import { main } from "./index";
import { D2R } from "../../utils";
import Hammer from "./items/Hammer";
import Dispatcher from "../Dispatcher";
import _Item from "./items/_Item";

export default class Bar extends PIXI.Container {

    private hammer: PIXI.Container;

    private barWidth: number;
    private bar: PIXI.Graphics;

    private startTime: number;
    private time: number;
    private timer: NodeJS.Timer;
    private oldWidth: number;

    private levelStarted: boolean;

    private beforeCounter_txt: PIXI.Text;
    private beforeTime: number;
    private beforeTimer: NodeJS.Timer;

    constructor() {
        super();

        this.drawBar();
        this.drawBackground();

        this.drawItems();

        this.beforeCounter_txt = new PIXI.Text("5", {
            fontFamily: "Verdana",
            fontSize: 18,
            fill: 0XFFFFFF,
            stroke: 0,
            strokeThickness: 2
        });
        this.addChild(this.beforeCounter_txt);
        this.beforeCounter_txt.x = 10 + this.bar.x + this.bar.width + 5;
        this.beforeCounter_txt.y = 10 + this.bar.y + this.bar.height / 2 - this.beforeCounter_txt.height / 2;

        this.startTime = 20 * 100;

        Dispatcher.on("userStart", this.onStart);
        Dispatcher.on("autoStart", this.onStart);
        Dispatcher.on("grabItem", this.onGrabItem)
    }

    public levelEnd(): void {
        clearInterval(this.timer);
    }

    public newLevel(): void {
        this.levelStarted = false;

        this.beforeTime = 5.5;
        this.beforeTimer = setInterval(this.updateBeforeTimer, 500);
    }

    private onStart = () => {
        if (this.levelStarted) return;

        // Stop the before Timer
        clearInterval(this.beforeTimer);
        this.beforeCounter_txt.text = "";

        this.levelStarted = true;

        this.time = this.startTime;
        this.timer = setInterval(this.updateTimer, 1000 / 100);
    }

    /**
     * Update the beforeTimer (time before it auto starts)
     */
    private updateBeforeTimer = () => {
        this.beforeTime -= .5;

        this.beforeCounter_txt.text = Math.ceil(this.beforeTime).toString();

        if (this.beforeTime === 2.5) {
            this.bar.clear().beginFill(0xFF6600, .5).drawRoundedRect(10, 10, this.barWidth, 16, 7);
        } else if (this.beforeTime <= 0) {
            Dispatcher.dispatch("autoStart");
        }
    }

    /**
     * Update the bar (time left)
     */
    private updateTimer = () => {
        this.time--;
        let target = this.time * this.barWidth / this.startTime;
        let current = this.oldWidth + (target - this.oldWidth) / 10;

        this.bar.clear().beginFill(0xFF0000, .5).drawRoundedRect(10, 10, current, 16, 7);

        this.oldWidth = current;
    }

    /**
     * Background
     */
    private drawBackground() {
        /*let b = new PIXI.Graphics();
        b.lineStyle(2).drawRect(1, 1, main.gameWidth - 2, 30 - 2);
        this.addChild(b);*/
    }

    /**
     * Bar
     */
    private drawBar() {
        this.barWidth = main.gameWidth - 20 - 80;

        let bg = new PIXI.Graphics();
        bg.beginFill(0xFFFFFF, .5).drawRoundedRect(10, 10, this.barWidth, 16, 7);
        this.addChild(bg);

        this.bar = new PIXI.Graphics();
        this.bar.beginFill(0x00FF00, .5).drawRoundedRect(10, 10, this.barWidth, 16, 7);
        this.addChild(this.bar);

        let border = new PIXI.Graphics();
        border.lineStyle(3, 0).drawRoundedRect(10, 10, this.barWidth, 16, 7);
        this.addChild(border);

        let shadow = new PIXI.Graphics();
        shadow.beginFill(0xFFFFFF, .4).drawRoundedRect(15, 13, this.barWidth - 10, 5, 3);
        this.addChild(shadow);

        this.oldWidth = this.barWidth;

    }

    private drawItems() {
        this.hammer = new PIXI.Container();
        this.hammer.x = main.gameWidth - 20;
        this.hammer.y = 15;
        this.addChild(this.hammer);

        this.hammer.addChild(Hammer.pic(true));

        Dispatcher.on("grabItem", this.onGrabItem);
        Dispatcher.on("useBonus", this.onUseBonus);
    }

    private onGrabItem = (item: _Item) => {
        if (item.type === "hammer") {
            this.hammer.removeChildren();
            this.hammer.addChild(Hammer.pic());
        } else if (item.type === "time") {
            this.time = this.startTime;
        }
    }

    private onUseBonus = (item: _Item, hasMore: boolean) => {
        if (item.type === "hammer") {
            if (!hasMore) {
                this.hammer.removeChildren();
                this.hammer.addChild(Hammer.pic(true));
            }
        }
    }
}