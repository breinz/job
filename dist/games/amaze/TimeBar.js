"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const Hammer_1 = require("./items/Hammer");
class Bar extends PIXI.Container {
    constructor() {
        super();
        this.drawBar();
        this.drawBackground();
        this.drawItems();
    }
    drawBackground() {
        let b = new PIXI.Graphics();
        b.lineStyle(2).drawRect(1, 1, index_1.main.gameWidth - 2, 30 - 2);
        this.addChild(b);
    }
    drawBar() {
        let b = new PIXI.Graphics();
        b.beginFill(0xDDDDDD).drawRect(0, 0, index_1.main.gameWidth, 30);
        this.addChild(b);
    }
    drawItems() {
        let h2 = Hammer_1.default.pic(true);
        h2.x = index_1.main.gameWidth - 20;
        h2.y = 15;
        this.addChild(h2);
    }
}
exports.default = Bar;
//# sourceMappingURL=TimeBar.js.map