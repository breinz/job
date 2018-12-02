import { main } from ".";
import Cell from "./Cell";

export default class Maze extends PIXI.Container {

    /**
     * The current level
     */
    private _level: number;

    private w: number;
    private h: number;

    constructor() {
        super();

        this.w = main.gameWidth - 2;
        this.h = main.gameHeight - 30;

        this.drawBackground();
    }

    /**
     * Sets a level
     */
    public set level(value: number) {
        this._level = value;
        this.drawMaze();
    }

    /**
     * Background
     */
    private drawBackground(): void {
        var b = new PIXI.Graphics();
        b.lineStyle(2).drawRect(1, -1, this.w, this.h);
        this.addChild(b);
    }

    /**
     * Draw cells
     */
    private drawMaze(): void {
        let cell: Cell;
        const cell_size = main.gameWidth / (this._level + 2);

        let lastCell: Cell;

        for (let col = 0; col < this._level + 2; col++) {
            for (let row = 0; row < this._level + 2; row++) {
                cell = new Cell(cell_size);
                cell.x = row * cell_size;
                cell.y = col * cell_size;
                this.addChild(cell);

                if (lastCell) {
                    cell.left = lastCell;
                }
                lastCell = cell;
            }
        }
    }
}