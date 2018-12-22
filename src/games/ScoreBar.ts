import Dispatcher from "./Dispatcher";

export default class ScoreBar extends PIXI.Container {

    private score_txt: PIXI.Text;
    private score: number;

    constructor(width: number) {
        super();

        let b = new PIXI.Graphics();
        b.beginFill(0).drawRect(0, 0, width, 30);
        this.addChild(b);

        this.score = 0;

        this.score_txt = new PIXI.Text(this.formatScore(0), { fontFamily: "Verdana", fontSize: 18, fill: 0xFFFFFF });
        this.score_txt.x = 5;
        this.score_txt.y = 15 - this.score_txt.height / 2;
        this.addChild(this.score_txt);
        Dispatcher.on("addScore", this.addScore);
    }

    private addScore = (value: number): void => {
        this.score += value;
        this.score_txt.text = this.formatScore(this.score);
    }

    private formatScore(value: number): string {
        value = Math.max(0, Math.round(value));
        if (value < 10) return "00000" + value;
        if (value < 100) return "0000" + value;
        if (value < 1000) return "000" + value;
        if (value < 10000) return "00" + value;
        return value.toString();

    }
}