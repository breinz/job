import { main } from "./index";

export default class TimeBar extends PIXI.Container {

    constructor() {
        super();

        this.drawBar();
        this.drawBackground();
    }

    /**
     * Background
     */
    private drawBackground() {
        let b = new PIXI.Graphics();
        b.lineStyle(2).drawRect(1, 1, main.gameWidth - 2, 30 - 2);
        this.addChild(b);
    }

    /**
     * Bar
     */
    private drawBar() {
        let b = new PIXI.Graphics();
        b.beginFill(0xDDDDDD).drawRect(0, 0, main.gameWidth, 30);
        this.addChild(b);
    }
}