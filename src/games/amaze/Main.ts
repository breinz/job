import * as PIXI from "pixi.js";
import { GameParams } from "../custom";
import Game from "./Game";

declare let game_params: GameParams;

export default class Main {
    /**
     * Pixi application
     */
    public app: PIXI.Application;

    public gameWidth: number;
    public gameHeight: number;

    constructor() {
        this.gameWidth = game_params.width;
        this.gameHeight = game_params.height;
    }

    public start() {
        PIXI.utils.skipHello();
        this.app = new PIXI.Application({
            width: this.gameWidth,
            height: this.gameHeight + 40,
            transparent: true,
            antialias: true
        });
        document.getElementById("game").appendChild(this.app.view);

        this.app.stage.addChild(new Game(this));
    }
}
