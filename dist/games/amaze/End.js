"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dispatcher_1 = require("../Dispatcher");
const utils_1 = require("../../utils");
const _1 = require(".");
class End extends PIXI.Container {
    constructor() {
        super();
        this.onUserMove = (x, y) => {
            if (utils_1.distance(this, { x: x, y: y }, true) < 15) {
                this.grab();
            }
        };
        this.display = new PIXI.Container();
        let shape = new PIXI.Graphics();
        shape.lineStyle(2, 0xFFFFFF).beginFill(0xFF0000).moveTo(-3, 0).lineTo(-3, -7).lineTo(3, -7).lineTo(3, 0).lineTo(7, 0).lineTo(0, 7).lineTo(-7, 0).closePath();
        this.display.addChild(shape);
        Dispatcher_1.default.on("userMove", this.onUserMove);
    }
    start(cell) {
        cell.filled = true;
        this.addChild(this.display);
        this.x = cell.x + cell.size / 2 + 10;
        this.y = cell.y + cell.size / 2 + 10;
    }
    grab() {
        _1.main.game.levelEnd();
    }
}
exports.default = End;
//# sourceMappingURL=End.js.map