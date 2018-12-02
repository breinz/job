export default class Cell extends PIXI.Container {

    private size: number;

    public _left: Cell;
    public _right: Cell;

    private l: PIXI.Graphics;
    private r: PIXI.Graphics;
    private t: PIXI.Graphics;
    private b: PIXI.Graphics;

    constructor(size: number) {
        super();

        this.size = size;

        this.l = new PIXI.Graphics();
        this.l.lineStyle(2, 0, 1, 1).moveTo(0, 0).lineTo(0, size);
        this.addChild(this.l);

        this.r = new PIXI.Graphics();
        this.r.lineStyle(2, 0, 1, 1).moveTo(size, 0).lineTo(size, size);
        this.addChild(this.r);

        this.t = new PIXI.Graphics();
        this.t.lineStyle(2, 0, 1, 1).moveTo(0, 0).lineTo(size, 0);
        this.addChild(this.t);

        this.b = new PIXI.Graphics();
        this.b.lineStyle(2, 0, 1, 1).moveTo(0, size).lineTo(size, size);
        this.addChild(this.b);
    }

    /**
     * Set left neighbor
     */
    public set left(cell: Cell) {
        this._left = cell;
        cell._right = this;
    }
}