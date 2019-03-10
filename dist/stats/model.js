"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const statSchema = new mongoose_1.Schema({
    date: Date,
    path: String,
    ip: String,
    country: String, countryCode: String, region: String, regionName: String, city: String,
});
exports.Stat = mongoose_1.model("Stat", statSchema);
exports.default = exports.Stat;
//# sourceMappingURL=model.js.map