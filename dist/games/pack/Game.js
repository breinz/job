"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Game {
    constructor(app) {
        this.stage = app.stage;
        let s = new PIXI.Graphics();
        s.beginFill(0xFF0000).drawRect(0, 0, 200, 200);
        this.stage.addChild(s);
    }
}
exports.default = Game;
//# sourceMappingURL=Game.js.map