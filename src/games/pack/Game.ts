export default class Game {

    public stage: PIXI.Container;

    constructor(app: PIXI.Application) {
        this.stage = app.stage;

        let s: PIXI.Graphics = new PIXI.Graphics();
        s.beginFill(0xFF0000).drawRect(0, 0, 200, 200);
        this.stage.addChild(s);
    }
}