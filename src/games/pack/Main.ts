import * as PIXI from "pixi.js";
import { GameParams } from "./custom";
import Game from "./Game";

declare let game_params: GameParams;

export default class Main {
    /**
     * Pixi application
     */
    public app: PIXI.Application;

    constructor() {
        PIXI.utils.skipHello();
        this.app = new PIXI.Application({
            width: game_params.width,
            height: game_params.height,
            transparent: true,
            antialias: true
        });
        document.getElementById("game").appendChild(this.app.view);

        new Game(this.app);
    }
}
