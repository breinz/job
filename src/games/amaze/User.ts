import Cell from "./Cell";
import { TimelineMax, TweenLite, Quart, Back, Quint } from "gsap";
import { main } from ".";
import Dispatcher from "../Dispatcher";
import _Item from "./items/_Item";
import { D2R } from "../../utils";

export default class User extends PIXI.Container {

    private shape: PIXI.Container;
    private cta: PIXI.Graphics;
    private cta_anim: TimelineMax;
    private target: { x: number, y: number };
    private cell: Cell;
    private start_cell: Cell;

    private bonuses: _Item[];

    private startedFlag: boolean;
    private following: boolean = false;

    constructor() {
        super();

        this.drawShape();
        this.shape.interactive = true;

        this.cta = new PIXI.Graphics();
        this.cta.lineStyle(10, 0xFFFFFF).drawEllipse(0, 0, 1, .5);
        this.cta.y = 5;
        this.cta.alpha = 1.5;

        Dispatcher.on("hitOut", this.onHitOut);
        Dispatcher.on("hitWall", this.onHitWall);

        this.bonuses = [];
        Dispatcher.on("grabItem", this.onGrabItem);
    }

    private drawShape() {
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
        light.rotation = 45 * D2R;
        this.shape.addChild(light);

        let pointLight = new PIXI.Graphics();
        pointLight.beginFill(0xFFFFFF, .8).drawCircle(-3, -4, 1.5);
        this.shape.addChild(pointLight);

        let innerShadow = new PIXI.Graphics();
        innerShadow.beginFill(0, .25).moveTo(7, -7).bezierCurveTo(7, 0, 5, 5, -5, 7).lineTo(7, 7).closePath();
        innerShadow.mask = masq;
        this.shape.addChild(innerShadow);
    }

    public start(cell: Cell): void {
        this.scale = new PIXI.Point(1, 1);

        cell.filled = true;

        this.start_cell = cell;

        if (!this.startedFlag) {
            this.addChild(this.shape);

            this.addChildAt(this.cta, 1);
            this.cta_anim = new TimelineMax({ repeat: -1 });
            this.cta_anim.add(
                TweenLite.to(this.cta, 2, { width: 100, height: 40, alpha: 0, ease: Quart.easeOut, rotation: 0 })
            );
        }

        this.restart();
        this.shape.on("mouseover", this.onMouseOver);

        this.startedFlag = true;
    }

    private restart() {
        this.x = this.start_cell.x + 10 + this.start_cell.size / 2;
        this.y = this.start_cell.y + 10 + this.start_cell.size / 2;

        this.cta.visible = true;
        this.cta_anim.restart();

        this.cell = this.start_cell;

        this.follow = false;
    }

    private set follow(value: boolean) {
        if (this.following === value) return;

        if (value) {
            main.app.stage.on("mousemove", this.onMouseMove);
            main.app.ticker.add(this.move);
            this.shape.off("mouseover", this.onMouseOver);
            Dispatcher.dispatch("userStart");
        } else {
            main.app.stage.off("mousemove", this.onMouseMove);
            main.app.ticker.remove(this.move);
            this.shape.on("mouseover", this.onMouseOver);
        }

        this.following = value;
    }

    /**
     * Mouse over
     * Start following
     */
    private onMouseOver = (): void => {
        this.cta_anim.pause();
        this.cta.visible = false;

        this.follow = true;
    }

    /**
     * Mouse move on stage
     * Register the new position
     */
    private onMouseMove = (e: PIXI.interaction.InteractionEvent): void => {
        this.target = {
            x: e.data.global.x,
            y: e.data.global.y - 30
        };
    }

    private onHitOut = () => {
        this.restart();
    }

    private onHitWall = (from: Cell, to: Cell) => {
        if (this.hasBonus("hammer", true)) {
            from.break(to);
        } else {
            this.restart();
        }
    }

    /**
     * Do move the user
     */
    private move = (): void => {
        let oldCell = this.cell;//: Cell = main.game.maze.findCell(this);

        this.x += (this.target.x - this.x) / 40;
        this.y += (this.target.y - this.y) / 40;

        this.cell = main.game.maze.findCell(this);

        if (oldCell) {
            if (!this.cell) {
                Dispatcher.dispatch("hitOut");
                Dispatcher.dispatch("addScore", -1);
            } else if (this.cell !== oldCell && !this.cell.openTo(oldCell)) {
                Dispatcher.dispatch("hitWall", oldCell, this.cell);
                Dispatcher.dispatch("addScore", -1);
            }
        }

        //console.log("dispatch");
        Dispatcher.dispatch("userMove", this.x, this.y);
    }

    /**
     * 
     * @param type The bonus type
     * @param use Should we use that bonus
     */
    private hasBonus(type: string, use: boolean = false): boolean {
        for (let i = 0; i < this.bonuses.length; i++) {
            if (this.bonuses[i].type === type) {
                if (use) {
                    const used = this.bonuses.splice(i, 1)[0];
                    Dispatcher.dispatch("useBonus", used, this.hasBonus(type));
                }
                return true;
            }
        }
        return false;
    }

    private onGrabItem = (item: _Item) => {
        if (item.isBonus) {
            this.bonuses.push(item);
        }
    }

    public levelEnd(): void {
        //this.visible = false;
        let anim = { value: 1 };
        TweenLite.to(anim, 1, {
            value: 0,
            ease: Quint.easeOut,
            onUpdate: () => {
                this.scale = new PIXI.Point(anim.value, anim.value)
            }
        });
        this.follow = false;
    }


}