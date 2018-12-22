import _Item from "./_Item";
import { main } from "..";
import { D2R } from "../../../utils";
import { TimelineMax, TweenLite, Quint, Sine } from "gsap";

export default class Time extends _Item {

    private hand: PIXI.Graphics;
    private hand2: PIXI.Graphics;
    private timeline: TimelineMax;

    constructor() {
        super();

        this.type = "time";

        let container = new PIXI.Container();
        this.addChild(container);

        let b = new PIXI.Graphics();
        b.lineStyle(3, 0).beginFill(0xFFFFFF).drawCircle(0, 0, 8);
        container.addChild(b);

        this.hand2 = new PIXI.Graphics();
        this.hand2.lineStyle(1, 0x999999).moveTo(0, 2).lineTo(0, -6);
        this.hand2.rotation = Math.random() * Math.PI * 2;
        container.addChild(this.hand2);

        this.hand = new PIXI.Graphics();
        this.hand.lineStyle(2).moveTo(0, 2).lineTo(0, -8);
        this.hand.rotation = Math.random() * Math.PI * 2;
        container.addChild(this.hand);

        let shadow = new PIXI.Graphics();
        shadow.beginFill(0, .2).drawEllipse(0, 11, 5, 2);
        this.addChild(shadow);

        this.timeline = new TimelineMax({ repeat: -1 });
        this.timeline.add(TweenLite.to(container, 2.5, { y: -3, ease: Quint.easeInOut }));
        this.timeline.add(TweenLite.to(container, 2, { y: 0, ease: Sine.easeInOut }));
        this.timeline.add(TweenLite.to(shadow, 2.5, { width: 7, alpha: .5, ease: Quint.easeInOut }), 0);
        this.timeline.add(TweenLite.to(shadow, 2, { width: 9, alpha: 1, ease: Sine.easeInOut }), 2.5);
        this.timeline.play(Math.random() * 4);

        main.app.ticker.add(this.rotate);
    }

    private rotate = () => {
        this.hand.rotation -= .4 * D2R;
        this.hand2.rotation -= 3 * D2R;
    }

    protected grab() {

        main.app.ticker.remove(this.rotate);
        this.timeline.pause();
        this.timeline.kill();
        this.timeline = null;

        //main.game.topbar.bonusTime();
        super.grab();
    }

}