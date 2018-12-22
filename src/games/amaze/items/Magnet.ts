export default class Magnet extends PIXI.Container {


    constructor() {
        super();

        let b = new PIXI.Graphics();
        b.lineStyle(2, 0xFF0000).drawEllipse(0, 0, 6, 3).drawEllipse(0, 0, 3, 6);
        this.addChild(b);
    }

}