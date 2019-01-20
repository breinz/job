"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PIXI = require("pixi.js");
const Game_1 = require("./Game");
class Main {
    constructor() {
        PIXI.utils.skipHello();
        this.app = new PIXI.Application({
            width: game_params.width,
            height: game_params.height,
            transparent: true,
            antialias: true
        });
        document.getElementById("game").appendChild(this.app.view);
        new Game_1.default(this.app);
    }
}
exports.default = Main;
//# sourceMappingURL=Main.js.map