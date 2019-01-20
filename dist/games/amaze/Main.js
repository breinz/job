"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PIXI = require("pixi.js");
const Game_1 = require("./Game");
const ScoreBar_1 = require("../ScoreBar");
class Main {
    constructor() {
        this.gameWidth = game_params.width;
        this.gameHeight = game_params.height;
    }
    start() {
        PIXI.utils.skipHello();
        this.app = new PIXI.Application({
            width: this.gameWidth,
            height: this.gameHeight + 40,
            transparent: true,
            antialias: true
        });
        document.getElementById("game").appendChild(this.app.view);
        this.app.stage.interactive = true;
        this.game = new Game_1.default(this);
        this.app.stage.addChild(this.game);
        this.game.startLevel();
        this.scoreBar = new ScoreBar_1.default(this.gameWidth);
        this.scoreBar.y = this.gameHeight;
        this.app.stage.addChild(this.scoreBar);
    }
}
exports.default = Main;
//# sourceMappingURL=Main.js.map