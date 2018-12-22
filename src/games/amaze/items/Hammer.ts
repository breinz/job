import _Item from "./_Item";
import { TimelineMax, Quint, TweenLite, Linear, Bounce, Back, Elastic } from "gsap";
import { D2R } from "../../../utils";

export default class Hammer extends _Item {

    constructor() {
        super();

        this.type = "hammer";
        this.isBonus = true;

        let h = Hammer.pic();
        this.addChild(h);
    }

    public static pic(shallow: boolean = false): PIXI.Container {
        let container = new PIXI.Container();

        let halo = new PIXI.Graphics();
        container.addChild(halo);
        halo.x = 1.5;
        halo.y = .5;
        halo.filters = [new PIXI.filters.BlurFilter(2, 3)];
        if (!shallow) {


            halo
                .beginFill(0xFFFF00, .5).drawStar(Math.random() * 4 - 2, Math.random() * 4 - 2, 5, 23, 3)
                .beginFill(0xFFFFFF, .5).drawCircle(0, 0, 12);

            // TODO: Remove that tween onGrab
            let tl = new TimelineMax({ repeat: -1 });
            tl.add(TweenLite.to(halo, 2, { width: 10, height: 10, ease: Quint.easeIn }));
            tl.add(TweenLite.to(halo, 2, { width: halo.width, height: halo.height, ease: Quint.easeOut }));
            tl.add(TweenLite.to(halo, 4, { rotation: 360 * D2R, ease: Back.easeInOut }), 0);
            tl.play(Math.random() * 4);
        } else {
            halo.beginFill(0xFFFFFF, .5).drawCircle(0, 0, 12);
        }

        let handle = new PIXI.Graphics();
        if (shallow) {
            handle.beginFill(0xAAAAAA, 0);
        } else {
            handle.lineStyle(1).beginFill(0x00FFFF/*AA4488*/);
        }
        handle.drawRect(0, 0, 5, 9);
        handle.x = .5;
        handle.y = .5;
        container.addChild(handle);

        if (!shallow) {
            let handle_shadow = new PIXI.Graphics();
            handle_shadow.beginFill(0, .3).drawRect(2.5, 1, 2, 7);
            handle_shadow.x = .5;
            handle_shadow.y = .5;
            container.addChild(handle_shadow);
        }


        let head = new PIXI.Graphics();
        container.addChild(head);
        if (shallow) {
            head.beginFill(0xAAAAAA, 0); // TODO: This is useless

        } else {
            head.lineStyle(1).beginFill(0x666666)

            let head_shadow = new PIXI.Graphics();
            head_shadow.x = .5;
            head_shadow.y = .5;
            container.addChild(head_shadow);
            head_shadow.lineStyle(1, 0)
                .moveTo(6, 0)
                .lineTo(5, -2)
                .lineTo(5, -4)
                .moveTo(5, -5)
                .lineTo(5, -6)
                .lineTo(6, -6);
        }
        head.moveTo(0, 0)
            .lineTo(-5, 0)
            .lineTo(-5, -5)
            .lineTo(-2, -5)
            .lineTo(0, -8)
            .lineTo(7, -8)
            .lineTo(8, -6)
            .lineTo(8, -2)
            .lineTo(7, 0)
            .lineTo(5, 0)
            .closePath();
        head.x = .5;
        head.y = .5;


        if (shallow) {

            let light = new PIXI.Graphics();
            light.lineStyle(1, 0);
            light.moveTo(0, 9)
                .lineTo(0, 0)
                .lineTo(-5, 0)
                .lineTo(-5, -5)
                .lineTo(-2, -5)
                .lineTo(0, -8)
                .lineTo(7, -8);
            light.x = light.y = .5;
            container.addChild(light);

            let shadow = new PIXI.Graphics();
            shadow.lineStyle(1, 0x666666);
            shadow.moveTo(7, -8)
                .lineTo(8, -6)
                .lineTo(8, -2)
                .lineTo(7, 0)
                .lineTo(5, 0)
                .lineTo(5, 9)
                .lineTo(0, 9);
            shadow.x = shadow.y = .5;
            container.addChild(shadow);

            let fill = new PIXI.Graphics();
            fill.beginFill(0, .1);
            fill.moveTo(7, -8)
                .lineTo(8, -6)
                .lineTo(8, -2)
                .lineTo(7, 0)
                .lineTo(5, 0)
                .lineTo(5, 9)
                .lineTo(0, 9)
                .lineTo(0, 0)
                .lineTo(-5, 0)
                .lineTo(-5, -5)
                .lineTo(-2, -5)
                .lineTo(0, -8)
                .lineTo(7, -8);
            container.addChild(fill);
        }

        return container;
    }

}