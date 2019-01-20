"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Dispatcher {
    constructor() {
        this.catalog = {};
    }
    dispatch(type, ...args) {
        if (!(type in this.catalog))
            return;
        this.catalog[type].forEach(callback => {
            callback.apply(null, args);
        });
    }
    on(type, callback) {
        if (this.catalog[type] === undefined) {
            this.catalog[type] = [];
        }
        this.catalog[type].push(callback);
    }
    off(type, callback) {
        for (let index = this.catalog[type].length - 1; index >= 0; index--) {
            if (this.catalog[type][index] === callback) {
                delete this.catalog[type][index];
            }
        }
    }
}
exports.default = new Dispatcher();
//# sourceMappingURL=Dispatcher.js.map