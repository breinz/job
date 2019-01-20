"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gsap_1 = require("gsap");
const _1 = require(".");
const Dispatcher_1 = require("../Dispatcher");
const utils_1 = require("../../utils");
class User extends PIXI.Container {
    constructor() {
        super();
        this.following = false;
        this.onMouseOver = () => {
            this.cta_anim.pause();
            this.cta.visible = false;
            this.follow = true;
        };
        this.onMouseMove = (e) => {
            this.target = {
                x: e.data.global.x,
                y: e.data.global.y - 30
            };
        };
        this.onHitOut = () => {
            this.restart();
        };
        this.onHitWall = (from, to) => {
            if (this.hasBonus("hammer", true)) {
                from.break(to);
            }
            else {
                this.restart();
            }
        };
        this.move = () => {
            let oldCell = this.cell;
            this.x += (this.target.x - this.x) / 40;
            this.y += (this.target.y - this.y) / 40;
            this.cell = _1.main.game.maze.findCell(this);
            if (oldCell) {
                if (!this.cell) {
                    Dispatcher_1.default.dispatch("hitOut");
                    Dispatcher_1.default.dispatch("addScore", -1);
                }
                else if (this.cell !== oldCell && !this.cell.openTo(oldCell)) {
                    Dispatcher_1.default.dispatch("hitWall", oldCell, this.cell);
                    Dispatcher_1.default.dispatch("addScore", -1);
                }
            }
            Dispatcher_1.default.dispatch("userMove", this.x, this.y);
        };
        this.onGrabItem = (item) => {
            if (item.isBonus) {
                this.bonuses.push(item);
            }
        };
        this.drawShape();
        this.shape.interactive = true;
        this.cta = new PIXI.Graphics();
        this.cta.lineStyle(10, 0xFFFFFF).drawEllipse(0, 0, 1, .5);
        this.cta.y = 5;
        this.cta.alpha = 1.5;
        Dispatcher_1.default.on("hitOut", this.onHitOut);
        Dispatcher_1.default.on("hitWall", this.onHitWall);
        this.bonuses = [];
        Dispatcher_1.default.on("grabItem", this.onGrabItem);
    }
    drawShape() {
        this.shape = new PIXI.Container();
        let shadow = new PIXI.Graphics();
        shadow.beginFill(0, .2).drawEllipse(0, 7, 10, 4);
        this.addChild(shadow);
        let ball = new PIXI.Graphics();
        ball.lineStyle(0).beginFill(0xE4E4E4).drawCircle(0, 0, 7).drawCircle(0, 0, 1);
        this.shape.addChild(ball);
        let masq = new PIXI.Graphics();
        masq.beginFill(0).drawCircle(0, 0, 7).drawCircle(0, 0, 1);
        this.shape.addChild(masq);
        let light = new PIXI.Graphics();
        light.beginFill(0xEEEEEE, .9).drawEllipse(-5.5, -.5, 4, 5);
        light.mask = masq;
        light.rotation = 45 * utils_1.D2R;
        this.shape.addChild(light);
        let pointLight = new PIXI.Graphics();
        pointLight.beginFill(0xFFFFFF, .8).drawCircle(-3, -4, 1.5);
        this.shape.addChild(pointLight);
        let innerShadow = new PIXI.Graphics();
        innerShadow.beginFill(0, .25).moveTo(7, -7).bezierCurveTo(7, 0, 5, 5, -5, 7).lineTo(7, 7).closePath();
        innerShadow.mask = masq;
        this.shape.addChild(innerShadow);
    }
    start(cell) {
        this.scale = new PIXI.Point(1, 1);
        cell.filled = true;
        this.start_cell = cell;
        if (!this.startedFlag) {
            this.addChild(this.shape);
            this.addChildAt(this.cta, 1);
            this.cta_anim = new gsap_1.TimelineMax({ repeat: -1 });
            this.cta_anim.add(gsap_1.TweenLite.to(this.cta, 2, { width: 100, height: 40, alpha: 0, ease: gsap_1.Quart.easeOut, rotation: 0 }));
        }
        this.restart();
        this.shape.on("mouseover", this.onMouseOver);
        this.startedFlag = true;
    }
    restart() {
        this.x = this.start_cell.x + 10 + this.start_cell.size / 2;
        this.y = this.start_cell.y + 10 + this.start_cell.size / 2;
        this.cta.visible = true;
        this.cta_anim.restart();
        this.cell = this.start_cell;
        this.follow = false;
    }
    set follow(value) {
        if (this.following === value)
            return;
        if (value) {
            _1.main.app.stage.on("mousemove", this.onMouseMove);
            _1.main.app.ticker.add(this.move);
            this.shape.off("mouseover", this.onMouseOver);
            Dispatcher_1.default.dispatch("userStart");
        }
        else {
            _1.main.app.stage.off("mousemove", this.onMouseMove);
            _1.main.app.ticker.remove(this.move);
            this.shape.on("mouseover", this.onMouseOver);
        }
        this.following = value;
    }
    hasBonus(type, use = false) {
        for (let i = 0; i < this.bonuses.length; i++) {
            if (this.bonuses[i].type === type) {
                if (use) {
                    const used = this.bonuses.splice(i, 1)[0];
                    Dispatcher_1.default.dispatch("useBonus", used, this.hasBonus(type));
                }
                return true;
            }
        }
        return false;
    }
    levelEnd() {
        let anim = { value: 1 };
        gsap_1.TweenLite.to(anim, 1, {
            value: 0,
            ease: gsap_1.Quint.easeOut,
            onUpdate: () => {
                this.scale = new PIXI.Point(anim.value, anim.value);
            }
        });
        this.follow = false;
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map