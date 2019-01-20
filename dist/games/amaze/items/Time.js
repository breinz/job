"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _Item_1 = require("./_Item");
const __1 = require("..");
const utils_1 = require("../../../utils");
const gsap_1 = require("gsap");
class Time extends _Item_1.default {
    constructor() {
        super();
        this.rotate = () => {
            this.hand.rotation -= .4 * utils_1.D2R;
            this.hand2.rotation -= 3 * utils_1.D2R;
        };
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
        this.timeline = new gsap_1.TimelineMax({ repeat: -1 });
        this.timeline.add(gsap_1.TweenLite.to(container, 2.5, { y: -3, ease: gsap_1.Quint.easeInOut }));
        this.timeline.add(gsap_1.TweenLite.to(container, 2, { y: 0, ease: gsap_1.Sine.easeInOut }));
        this.timeline.add(gsap_1.TweenLite.to(shadow, 2.5, { width: 7, alpha: .5, ease: gsap_1.Quint.easeInOut }), 0);
        this.timeline.add(gsap_1.TweenLite.to(shadow, 2, { width: 9, alpha: 1, ease: gsap_1.Sine.easeInOut }), 2.5);
        this.timeline.play(Math.random() * 4);
        __1.main.app.ticker.add(this.rotate);
    }
    grab() {
        __1.main.app.ticker.remove(this.rotate);
        this.timeline.pause();
        this.timeline.kill();
        this.timeline = null;
        super.grab();
    }
}
exports.default = Time;
//# sourceMappingURL=Time.js.map