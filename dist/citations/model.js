"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const citationSchema = new mongoose_1.Schema({
    content: String,
    source: String
});
exports.Citation = mongoose_1.model("Citation", citationSchema);
exports.default = exports.Citation;
//# sourceMappingURL=model.js.map