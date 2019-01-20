"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dispatcher_1 = require("../../Dispatcher");
const utils_1 = require("../../../utils");
class _Item extends PIXI.Container {
    constructor() {
        super();
        this.type = "abstract";
        this.isBonus = false;
        this.onUserMove = (x, y) => {
            if (utils_1.distance(this, { x: x - 10, y: y - 10 }, true) < 15) {
                this.grab();
            }
        };
        this.onRemoved = () => {
            Dispatcher_1.default.off("userMove", this.onUserMove);
        };
        Dispatcher_1.default.on("userMove", this.onUserMove);
        this.on("removed", this.onRemoved);
    }
    grab() {
        this.parent.removeChild(this);
        Dispatcher_1.default.dispatch("grabItem", this);
    }
}
exports.default = _Item;
//# sourceMappingURL=_Item.js.map