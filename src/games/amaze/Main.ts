import * as PIXI from "pixi.js";
import { GameParams } from "../custom";
import Game from "./Game";
import ScoreBar from "../ScoreBar";

declare let game_params: GameParams;

export default class Main {
    /**
     * Pixi application
     */
    public app: PIXI.Application;

    public scoreBar: ScoreBar;

    public gameWidth: number;
    public gameHeight: number;

    /**
     * The game
     */
    public game: Game;

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

        this.app.stage.interactive = true;

        this.game = new Game(this);
        this.app.stage.addChild(this.game);
        this.game.startLevel();

        this.scoreBar = new ScoreBar(this.gameWidth);
        this.scoreBar.y = this.gameHeight;
        this.app.stage.addChild(this.scoreBar);
    }
}
