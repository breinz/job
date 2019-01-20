"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const travelSchema = new mongoose_1.Schema({
    name: String,
    title: String,
    url: String,
    parent: { type: mongoose_1.Schema.Types.ObjectId, ref: "Travel" },
    pic: { type: mongoose_1.Schema.Types.ObjectId, ref: "Image" },
    description: String
});
exports.Travel = mongoose_1.model("Travel", travelSchema);
exports.default = exports.Travel;
//# sourceMappingURL=model.js.map