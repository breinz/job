import _Item from "./_Item";
import { D2R } from "../../../utils";
import { TimelineMax, TweenLite, Quint, Quart, Sine } from "gsap";
import Dispatcher from "../../Dispatcher";
import { main } from "..";

export default class Bonus extends _Item {

    private level: number;

    private colors: number[] = [0x66DD33, 0x3388DD, 0xDD3333];
    private scores: number[] = [25, 100, 500];
    private points: number[] = [100, 200, 500];

    private timeline: TimelineMax;

    constructor(level: number) {
        super();
        this.level = level;

        let m = new PIXI.Graphics();
        m.beginFill(0).drawCircle(0, 0, 7);
        this.addChild(m);

        let container = new PIXI.Container();
        this.addChild(container);
        container.mask = m;

        let b = new PIXI.Graphics();
        b.beginFill(this.colors[level]).drawCircle(0, 0, 6);
        container.addChild(b);

        let s = new PIXI.Graphics();
        s.beginFill(0, .3).moveTo(6, -6).bezierCurveTo(6, -1, -1, 6, -6, 6).lineTo(6, 6).closePath();
        container.addChild(s);

        let border = new PIXI.Graphics();
        border.lineStyle(2, this.colors[level]).drawCircle(0, 0, 6);
        container.addChild(border);

        let l = new PIXI.Graphics();
        l.beginFill(0xFFFFFF, level == 1 ? .3 : .6).drawEllipse(-1, -3, 3, 2)
        l.rotation = -45 * D2R;
        container.addChild(l);

        let shadow = new PIXI.Graphics();
        shadow.beginFill(0, .2).drawEllipse(0, 11, 5, 2);
        this.addChild(shadow);

        this.timeline = new TimelineMax({ repeat: -1 });
        this.timeline.add(TweenLite.to([container, m], 2.5, { y: -3, ease: Quint.easeInOut }));
        this.timeline.add(TweenLite.to([container, m], 2, { y: 0, ease: Sine.easeInOut }));
        this.timeline.add(TweenLite.to(shadow, 2.5, { width: 7, alpha: .5, ease: Quint.easeInOut }), 0);
        this.timeline.add(TweenLite.to(shadow, 2, { width: 9, alpha: 1, ease: Sine.easeInOut }), 2.5);
        this.timeline.play(Math.random() * 4);
    }

    protected grab(): void {
        Dispatcher.dispatch("addScore", this.scores[this.level]);
        this.timeline.pause();
        this.timeline = null;

        let t = new PIXI.Text(this.scores[this.level].toString(), {
            fontFamily: "Verdana",
            fontSize: 12 + this.level * 2,
            fill: this.colors[this.level],
            fontWeight: "bold",
            stroke: 0,
            strokeThickness: 2
        });
        t.position = new PIXI.Point(this.x + 10 - t.width / 2, this.y + 25);
        t.alpha = 2;
        TweenLite.to(t, 3, {
            y: t.y - 30,
            alpha: 0,
            ease: Quint.easeOut,
            onComplete: () => {
                main.game.removeChild(t);
            }
        });

        main.game.addChild(t);

        super.grab();
    }

}