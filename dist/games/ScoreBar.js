"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dispatcher_1 = require("./Dispatcher");
class ScoreBar extends PIXI.Container {
    constructor(width) {
        super();
        this.addScore = (value) => {
            this.score += value;
            this.score_txt.text = this.formatScore(this.score);
        };
        let b = new PIXI.Graphics();
        b.beginFill(0).drawRect(0, 0, width, 30);
        this.addChild(b);
        this.score = 0;
        this.score_txt = new PIXI.Text(this.formatScore(0), { fontFamily: "Verdana", fontSize: 18, fill: 0xFFFFFF });
        this.score_txt.x = 5;
        this.score_txt.y = 15 - this.score_txt.height / 2;
        this.addChild(this.score_txt);
        Dispatcher_1.default.on("addScore", this.addScore);
    }
    formatScore(value) {
        value = Math.max(0, Math.round(value));
        if (value < 10)
            return "00000" + value;
        if (value < 100)
            return "0000" + value;
        if (value < 1000)
            return "000" + value;
        if (value < 10000)
            return "00" + value;
        return value.toString();
    }
}
exports.default = ScoreBar;
//# sourceMappingURL=ScoreBar.js.map