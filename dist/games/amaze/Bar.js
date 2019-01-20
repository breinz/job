"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const Hammer_1 = require("./items/Hammer");
const Dispatcher_1 = require("../Dispatcher");
class Bar extends PIXI.Container {
    constructor() {
        super();
        this.onStart = () => {
            if (this.levelStarted)
                return;
            clearInterval(this.beforeTimer);
            this.beforeCounter_txt.text = "";
            this.levelStarted = true;
            this.time = this.startTime;
            this.timer = setInterval(this.updateTimer, 1000 / 100);
        };
        this.updateBeforeTimer = () => {
            this.beforeTime -= .5;
            this.beforeCounter_txt.text = Math.ceil(this.beforeTime).toString();
            if (this.beforeTime === 2.5) {
                this.bar.clear().beginFill(0xFF6600, .5).drawRoundedRect(10, 10, this.barWidth, 16, 7);
            }
            else if (this.beforeTime <= 0) {
                Dispatcher_1.default.dispatch("autoStart");
            }
        };
        this.updateTimer = () => {
            this.time--;
            let target = this.time * this.barWidth / this.startTime;
            let current = this.oldWidth + (target - this.oldWidth) / 10;
            this.bar.clear().beginFill(0xFF0000, .5).drawRoundedRect(10, 10, current, 16, 7);
            this.oldWidth = current;
        };
        this.onGrabItem = (item) => {
            if (item.type === "hammer") {
                this.hammer.removeChildren();
                this.hammer.addChild(Hammer_1.default.pic());
            }
            else if (item.type === "time") {
                this.time = this.startTime;
            }
        };
        this.onUseBonus = (item, hasMore) => {
            if (item.type === "hammer") {
                if (!hasMore) {
                    this.hammer.removeChildren();
                    this.hammer.addChild(Hammer_1.default.pic(true));
                }
            }
        };
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
        Dispatcher_1.default.on("userStart", this.onStart);
        Dispatcher_1.default.on("autoStart", this.onStart);
        Dispatcher_1.default.on("grabItem", this.onGrabItem);
    }
    levelEnd() {
        clearInterval(this.timer);
    }
    newLevel() {
        this.levelStarted = false;
        this.beforeTime = 5.5;
        this.beforeTimer = setInterval(this.updateBeforeTimer, 500);
    }
    drawBackground() {
    }
    drawBar() {
        this.barWidth = index_1.main.gameWidth - 20 - 80;
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
    drawItems() {
        this.hammer = new PIXI.Container();
        this.hammer.x = index_1.main.gameWidth - 20;
        this.hammer.y = 15;
        this.addChild(this.hammer);
        this.hammer.addChild(Hammer_1.default.pic(true));
        Dispatcher_1.default.on("grabItem", this.onGrabItem);
        Dispatcher_1.default.on("useBonus", this.onUseBonus);
    }
}
exports.default = Bar;
//# sourceMappingURL=Bar.js.map