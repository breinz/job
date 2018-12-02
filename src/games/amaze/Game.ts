import Main from "./Main";
import TimeBar from "./TimeBar";
import Maze from "./Maze";
import { main } from ".";
import User from "./User";

export default class Game extends PIXI.Container {

    private timeBar: TimeBar;
    private maze: Maze;
    private user: User;

    constructor(app: Main) {
        super();

        this.init();

        // Start the game
        this.maze.level = 0;
    }

    private init(): void {
        // Time bar
        this.timeBar = new TimeBar();
        this.addChild(this.timeBar);

        // Maze
        this.maze = new Maze();
        this.maze.y = 30;
        this.addChild(this.maze);

        // User
        this.user = new User();
        this.addChild(this.user);
    }
}