import Cell from "./Cell";
import Dispatcher from "../Dispatcher";
import { distance } from "../../utils";
import { main } from ".";

export default class End extends PIXI.Container {

    private display: PIXI.Container;

    constructor() {
        super();

        this.display = new PIXI.Container();

        let shape = new PIXI.Graphics();
        shape.lineStyle(2, 0xFFFFFF).beginFill(0xFF0000).moveTo(-3, 0).lineTo(-3, -7).lineTo(3, -7).lineTo(3, 0).lineTo(7, 0).lineTo(0, 7).lineTo(-7, 0).closePath();
        this.display.addChild(shape);

        Dispatcher.on("userMove", this.onUserMove);
    }

    public start(cell: Cell): void {
        cell.filled = true;
        this.addChild(this.display);
        this.x = cell.x + cell.size / 2 + 10;
        this.y = cell.y + cell.size / 2 + 10;
    }

    private onUserMove = (x: number, y: number): void => {
        if (distance(this, { x: x, y: y }, true) < 15) {
            //Dispatcher.off("userMove", this.onUserMove);
            this.grab();
        }
    }

    private grab(): void {
        main.game.levelEnd();
    }
}