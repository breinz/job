export default class User extends PIXI.Container {

    private shape: PIXI.Graphics;

    constructor() {
        super();

        this.shape = new PIXI.Graphics();
        this.shape.beginFill(0).drawCircle(0, 0, 5);
    }
}