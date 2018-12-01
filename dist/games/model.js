"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const gameSchema = new mongoose_1.Schema({
    name: { type: String, unique: true },
    width: { type: Number, default: 800 },
    height: { type: Number, default: 600 }
});
exports.Game = mongoose_1.model("Game", gameSchema);
exports.default = exports.Game;
//# sourceMappingURL=model.js.map