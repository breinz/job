import { shuffle, D2R } from "../../utils";
import { main } from ".";
import { TweenLite, TimelineLite, Linear, Power2 } from "gsap";

export default class Cell extends PIXI.Container {

    public size: number;

    public filled: boolean = false;

    public _left: Cell;
    public _right: Cell;
    public _top: Cell;
    public _bottom: Cell;

    private l: PIXI.Graphics;
    private r: PIXI.Graphics;
    private t: PIXI.Graphics;
    private b: PIXI.Graphics;

    private dealt: boolean = false;
    public maze_start: boolean = false;
    public prev: Cell;

    constructor(size: number) {
        super();

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

    /**
     * Set left neighbor
     */
    public set left(cell: Cell) {
        this._left = cell;
        cell._right = this;
    }

    /**
     * Set top neighbor
     */
    public set top(cell: Cell) {
        this._top = cell;
        cell._bottom = this;
    }

    private neighbor(value: string): Cell {
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

    /**
     * Check if a cell opens to another
     * @param cell The neighbor cell
     */
    public openTo(cell: Cell): boolean {
        if (this._left === cell) return !this.l.visible;
        if (this._right === cell) return !this.r.visible;
        if (this._top === cell) return !this.t.visible;
        if (this._bottom === cell) return !this.b.visible;
        return false;
    }

    /**
     * Set this cell as starting point and opens maze from here
     */
    public start(): void {
        this.dealt = true;
        this.maze_start = true;
        main.game.maze.registerPlaceholder(this);

        this.open();
    }

    /**
     * Open a cell to one of its neighbors if possible
     */
    public open(): void {
        const was_dealt = this.dealt;
        this.dealt = true;

        let possibles = shuffle(['l', 'r', 't', 'b']) as string[];
        let neighbor: Cell;
        let next: Cell;
        let direction: string;

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
            } else if (direction === 'r') {
                this.r.visible = false;
                neighbor.l.visible = false;
            } else if (direction === 't') {
                this.t.visible = false;
                neighbor.b.visible = false;
            } else if (direction === 'b') {
                this.b.visible = false;
                neighbor.t.visible = false;
            }
            neighbor.prev = this;
            neighbor.open();
        } else {
            if (!was_dealt) {
                main.game.maze.registerPlaceholder(this);
            }

            if (!this.prev.maze_start) {
                this.prev.open();
            }
        }
    }

    public break(to: Cell = null) {
        if (to === null) {
            this.l.visible = false;
            this.r.visible = false;
            this.t.visible = false;
            this.b.visible = false;
        } else {
            if (to === this._left) {
                this.l.visible = false;
                to.r.visible = false;
            } else if (to === this._right) {
                this.r.visible = false;
                to.l.visible = false;
            } else if (to === this._top) {
                this.t.visible = false;
                to.b.visible = false;
            } else if (to === this._bottom) {
                this.b.visible = false;
                to.t.visible = false;
            }

            this.breakWall(to);
        }
    }

    private breakWall(to: Cell): void {
        console.log("breakWall");
        let count = Math.round(Math.random() * 5 + 5);
        let container = new PIXI.Container();
        this.addChild(container);

        if (to === this._left) {
            container.rotation = -Math.PI / 2;
            container.y += this.size;
        } else if (to === this._right) {
            container.rotation = Math.PI / 2;
            container.x += this.size;
        } else if (to === this._bottom) {
            container.rotation = Math.PI;
            container.x += this.size;
            container.y += this.size;
        }

        let length = this.size / count;

        let timeline = new TimelineLite(
            {
                onComplete: () => {
                    this.removeChild(container)
                }
            });

        for (let i = 0; i < count; i++) {
            let bit = new PIXI.Graphics();
            bit.lineStyle(Math.random() * 3 + 2).moveTo(0, 0).lineTo(length, 0);
            bit.x = i * length;
            container.addChild(bit);

            const dist = Math.random() * 40 + 20;

            const duration = Math.random() * .5 + .5;
            timeline.add(
                TweenLite.to(bit, duration, {
                    y: - dist,
                    rotation: (Math.random() * 360 - 180) * D2R,
                    x: bit.x + Math.random() * dist - dist / 2,
                    ease: Power2.easeOut
                }), 0);
            timeline.add(
                TweenLite.to(bit, duration, {
                    alpha: 0,
                    ease: Linear.easeIn
                })
                , 0);

        }

    }

    private get bit(): number {
        return Math.random() * (this.size / 2) + 2;
    }

    private get randd(): number {
        return Math.random() * 40 + 20;
    }

    private get randr(): number {
        return (Math.random() * 180 - 180) * D2R
    }
}