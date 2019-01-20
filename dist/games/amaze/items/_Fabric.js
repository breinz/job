"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bonus_1 = require("./Bonus");
const Time_1 = require("./Time");
const Hammer_1 = require("./Hammer");
const Magnet_1 = require("./Magnet");
var Item;
(function (Item) {
    function generate() {
        let rand = Math.random() * 100;
        if (rand < 70) {
            return new Bonus_1.default(0);
        }
        else if (rand < 90) {
            return new Bonus_1.default(1);
        }
        else if (rand < 95) {
            return new Bonus_1.default(2);
        }
        else {
            rand = Math.random() * 100;
            if (rand < 33) {
                return new Time_1.default();
            }
            else if (rand < 66) {
                return new Hammer_1.default();
            }
            else {
                return new Magnet_1.default();
            }
        }
    }
    Item.generate = generate;
})(Item = exports.Item || (exports.Item = {}));
//# sourceMappingURL=_Fabric.js.map