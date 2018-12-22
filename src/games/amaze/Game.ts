import Main from "./Main";
import Bar from "./Bar";
import Maze from "./Maze";
import { main } from ".";
import User from "./User";
import End from "./End";
import Dispatcher from "../Dispatcher";
import { TweenLite, Quint } from "gsap";
import { distance } from "../../utils";

export default class Game extends PIXI.Container {

    public topbar: Bar;
    public maze: Maze;
    public user: User;
    public end: End;

    private level: number;

    private maskContainer: PIXI.Container;
    private masq: PIXI.Graphics;
    public container: PIXI.Container;

    constructor(app: Main) {
        super();

        this.init();

        this.level = -1;

    }

    /**
     * Start the game
     */
    public startLevel(): void {
        this.level = Math.min(++this.level, 9);

        this.maze.level = this.level;
        this.topbar.newLevel();
        this.open();
    }

    private nextLevel(): void {
        this.level++;
        this.maze.levelEnd();

        this.maze.level = this.level;
        this.topbar.newLevel();
        this.open();

    }

    public levelEnd = (): void => {
        this.user.levelEnd();
        this.topbar.levelEnd();

        this.close();
    }

    /**
     * Initialize the game
     */
    private init(): void {

        let img = PIXI.Sprite.fromImage("/img/paper.jpg");
        if (img.texture.baseTexture.hasLoaded) {

            console.log("hasLoaded");
        } else {
            img.texture.baseTexture.once("loaded", () => {
                img.width = img.width * 430 / img.height;
                img.height = 430;
                img.x = 200 - img.width / 2;
            })
        }
        this.addChild(img);

        // Time bar
        this.topbar = new Bar();
        this.addChild(this.topbar);

        // Game container
        this.container = new PIXI.Container();
        this.container.y = 30;

        // Game container for mask
        this.maskContainer = new PIXI.Container();
        this.addChild(this.maskContainer);

        this.maskContainer.addChild(this.container);

        // Mask
        this.masq = new PIXI.Graphics();
        this.masq.beginFill(0).drawCircle(0, 0, 260);
        this.container.addChild(this.masq);

        this.maskContainer.mask = this.masq;

        // Maze
        this.maze = new Maze();
        this.container.addChild(this.maze);

        // Maze border
        var b = new PIXI.Graphics();
        b.lineStyle(4, 0, 1, 1).drawRoundedRect(10, 40, main.gameWidth - 20, main.gameHeight - 30 - 20, 10);
        this.addChild(b);

        // User
        this.user = new User();
        this.container.addChild(this.user);

        // End
        this.end = new End();
        this.container.addChild(this.end);
    }

    private maskSize(obj: { x: number, y: number }): number {
        return Math.max(
            distance(obj, { x: 0, y: 10 }),
            distance(obj, { x: main.gameWidth - 0, y: 10 }),
            distance(obj, { x: 10, y: main.gameHeight - 40 }),
            distance(obj, { x: main.gameWidth - 10, y: main.gameHeight - 40 }),
        ) * 2;
    }

    /**
     * Open a game level
     */
    private open() {
        let size = this.maskSize(this.user);

        this.masq.x = this.user.x;
        this.masq.y = this.user.y;
        this.masq.width = this.masq.height = 0;
        TweenLite.to(this.masq, 2, { width: size, height: size, ease: Quint.easeInOut })
    }

    /**
     * Close a game level
     */
    private close() {
        let size = this.maskSize(this.end);

        this.masq.width = size;
        this.masq.height = size;
        this.masq.x = this.end.x;
        this.masq.y = this.end.y;
        TweenLite.to(this.masq, 2, {
            width: 0,
            height: 0,
            ease: Quint.easeInOut,
            onComplete: () => {
                this.nextLevel();
            }
        });
    }

}