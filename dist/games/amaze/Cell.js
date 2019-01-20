"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const _1 = require(".");
const gsap_1 = require("gsap");
class Cell extends PIXI.Container {
    constructor(size) {
        super();
        this.filled = false;
        this.dealt = false;
        this.maze_start = false;
        this.size = size;
        this.l = new PIXI.Graphics();
        this.l.lineStyle(4, 0, .51, 0).moveTo(0, 0).lineTo(0, size + 4);
        this.addChild(this.l);
        this.r = new PIXI.Graphics();
        this.r.lineStyle(4, 0, .51, 0).moveTo(size, 0).lineTo(size, size);
        this.addChild(this.r);
        this.t = new PIXI.Graphics();
        this.t.lineStyle(4, 0, .51, 0).moveTo(0, 0).lineTo(size, 0);
        this.addChild(this.t);
        this.b = new PIXI.Graphics();
        this.b.lineStyle(4, 0, .51, 0).moveTo(0, size).lineTo(size, size);
        this.addChild(this.b);
    }
    set left(cell) {
        this._left = cell;
        cell._right = this;
    }
    set top(cell) {
        this._top = cell;
        cell._bottom = this;
    }
    neighbor(value) {
        switch (value) {
            case 'l':
                return this._left;
                break;
            case 'r':
                return this._right;
                break;
            case 't':
                return this._top;
                break;
            case 'b':
                return this._bottom;
                break;
        }
        throw "This is not supposed to happen";
    }
    openTo(cell) {
        if (this._left === cell)
            return !this.l.visible;
        if (this._right === cell)
            return !this.r.visible;
        if (this._top === cell)
            return !this.t.visible;
        if (this._bottom === cell)
            return !this.b.visible;
        return false;
    }
    start() {
        this.dealt = true;
        this.maze_start = true;
        _1.main.game.maze.registerPlaceholder(this);
        this.open();
    }
    open() {
        const was_dealt = this.dealt;
        this.dealt = true;
        let possibles = utils_1.shuffle(['l', 'r', 't', 'b']);
        let neighbor;
        let next;
        let direction;
        for (let i = 0; i < possibles.length; i++) {
            neighbor = this.neighbor(possibles[i]);
            if (neighbor && !neighbor.dealt) {
                next = neighbor;
                direction = possibles[i];
                break;
            }
        }
        if (next) {
            if (direction === 'l') {
                this.l.visible = false;
                neighbor.r.visible = false;
            }
            else if (direction === 'r') {
                this.r.visible = false;
                neighbor.l.visible = false;
            }
            else if (direction === 't') {
                this.t.visible = false;
                neighbor.b.visible = false;
            }
            else if (direction === 'b') {
                this.b.visible = false;
                neighbor.t.visible = false;
            }
            neighbor.prev = this;
            neighbor.open();
        }
        else {
            if (!was_dealt) {
                _1.main.game.maze.registerPlaceholder(this);
            }
            if (!this.prev.maze_start) {
                this.prev.open();
            }
        }
    }
    break(to = null) {
        if (to === null) {
            this.l.visible = false;
            this.r.visible = false;
            this.t.visible = false;
            this.b.visible = false;
        }
        else {
            if (to === this._left) {
                this.l.visible = false;
                to.r.visible = false;
            }
            else if (to === this._right) {
                this.r.visible = false;
                to.l.visible = false;
            }
            else if (to === this._top) {
                this.t.visible = false;
                to.b.visible = false;
            }
            else if (to === this._bottom) {
                this.b.visible = false;
                to.t.visible = false;
            }
            this.breakWall(to);
        }
    }
    breakWall(to) {
        console.log("breakWall");
        let count = Math.round(Math.random() * 5 + 5);
        let container = new PIXI.Container();
        this.addChild(container);
        if (to === this._left) {
            container.rotation = -Math.PI / 2;
            container.y += this.size;
        }
        else if (to === this._right) {
            container.rotation = Math.PI / 2;
            container.x += this.size;
        }
        else if (to === this._bottom) {
            container.rotation = Math.PI;
            container.x += this.size;
            container.y += this.size;
        }
        let length = this.size / count;
        let timeline = new gsap_1.TimelineLite({
            onComplete: () => {
                this.removeChild(container);
            }
        });
        for (let i = 0; i < count; i++) {
            let bit = new PIXI.Graphics();
            bit.lineStyle(Math.random() * 3 + 2).moveTo(0, 0).lineTo(length, 0);
            bit.x = i * length;
            container.addChild(bit);
            const dist = Math.random() * 40 + 20;
            const duration = Math.random() * .5 + .5;
            timeline.add(gsap_1.TweenLite.to(bit, duration, {
                y: -dist,
                rotation: (Math.random() * 360 - 180) * utils_1.D2R,
                x: bit.x + Math.random() * dist - dist / 2,
                ease: gsap_1.Power2.easeOut
            }), 0);
            timeline.add(gsap_1.TweenLite.to(bit, duration, {
                alpha: 0,
                ease: gsap_1.Linear.easeIn
            }), 0);
        }
    }
    get bit() {
        return Math.random() * (this.size / 2) + 2;
    }
    get randd() {
        return Math.random() * 40 + 20;
    }
    get randr() {
        return (Math.random() * 180 - 180) * utils_1.D2R;
    }
}
exports.default = Cell;
//# sourceMappingURL=Cell.js.map