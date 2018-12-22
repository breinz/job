import { main } from ".";
import Cell from "./Cell";
import { shuffle } from "../../utils";
import { Item } from "./items/_Fabric";

export default class Maze extends PIXI.Container {

    /**
     * The current level
     */
    private _level: number;

    private w: number;
    private h: number;

    private arCells: Cell[][];
    private arPlaceHolders: Cell[];

    private cell_size: number;

    private container: PIXI.Container;

    constructor() {
        super();

        this.w = main.gameWidth - 20;
        this.h = main.gameHeight - 30 - 20;

        this.x = 10;
        this.y = 10;

        this.container = new PIXI.Container();
        this.container.mask = this.drawMask();
        this.addChild(this.container);

        this.drawBackground();
    }

    /**
     * @deprecated
     */
    public levelEnd(): void {
        this.container.removeChildren(1); // (keep background)
        this.arCells = [];
        this.arPlaceHolders = [];
    }

    /**
     * Sets a level
     */
    public set level(value: number) {
        this._level = value;

        this.arPlaceHolders = [];

        this.cell_size = (main.gameWidth - 20) / (value + 2);


        this.drawMaze();

        this.arPlaceHolders = shuffle(this.arPlaceHolders) as Cell[];

        this.placeUser();
        this.placeEnd();
        this.placeItems();
    }

    /**
     * Register a cell that can contain an item
     * @param cell The cell
     */
    public registerPlaceholder(cell: Cell): void {
        this.arPlaceHolders.push(cell);
    }

    /**
     * Find a cell containing the position
     * @param pos The position 
     */
    public findCell(pos: { x: number, y: number }): Cell {
        let x = Math.floor((pos.x - 10) / this.cell_size)
        let y = Math.floor((pos.y - 10) / this.cell_size)

        try {
            return this.arCells[y][x];
        } catch (e) {
            return null;
        }
    }

    private drawMask(): PIXI.Graphics {
        let m = new PIXI.Graphics();
        m.beginFill(0xFF0000, .5).drawRoundedRect(0, 0, this.w, this.h, 10);
        this.addChild(m);
        return m;
    }

    /**
     * Background
     */
    private drawBackground(): void {
        var b = new PIXI.Graphics();
        b.beginFill(0xFFFFFF, .1).drawRoundedRect(0, 0, this.w, this.h, 10);
        this.container.addChild(b);
    }

    /**
     * Draw cells
     */
    private drawMaze(): void {
        let cells: Cell[];
        this.arCells = [];

        let cell: Cell;
        //const cell_size = main.gameWidth / (this._level + 2);

        let prev: Cell;
        let prevs: Cell[] = [];

        for (let col = 0; col < this._level + 2; col++) {
            cells = [];
            for (let row = 0; row < this._level + 2; row++) {
                cell = new Cell(this.cell_size);
                cell.x = row * this.cell_size;
                cell.y = col * this.cell_size;
                this.container.addChild(cell);

                if (prev && row > 0) {
                    cell.left = prev;
                }
                prev = cell;

                if (col > 0) {
                    cell.top = prevs.shift();
                }

                prevs.push(cell);
                cells.push(cell);
                //this.arCells.push(cell);
            }
            this.arCells.push(cells);
        }

        this.arCells[0][0].start();
    }

    /**
     * Place the user in a cell
     */
    private placeUser(): void {
        main.game.user.start(this.arPlaceHolders[0]);
    }

    /**
     * Place the end in a cell
     */
    private placeEnd(): void {
        let cell = this.furthestCell(this.arPlaceHolders[0]);
        main.game.end.start(cell);
    }

    private placeItems(): void {
        for (let i = 0; i < this.arPlaceHolders.length; i++) {
            if (this.arPlaceHolders[i].filled) continue;

            let item = Item.generate();
            this.container.addChild(item);
            item.x = this.arPlaceHolders[i].x + this.arPlaceHolders[i].size / 2;
            item.y = this.arPlaceHolders[i].y + this.arPlaceHolders[i].size / 2;
        }
    }

    /**
     * Find the furthest cell from a given one
     * @param cell The furthers cell
     */
    private furthestCell(cell: Cell): Cell {
        let furthest: Cell;
        let dist: number = 0;
        for (let i = 0; i < this.arPlaceHolders.length; i++) {
            const d = Math.abs(cell.x - this.arPlaceHolders[i].x) + Math.abs(cell.y - this.arPlaceHolders[i].y);
            if (d > dist) {
                dist = d;
                furthest = this.arPlaceHolders[i];
            }
        }
        return furthest;
    }
}