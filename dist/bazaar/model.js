"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bazaarSchema = new mongoose_1.Schema({
    title: String, title_fr: String, title_en: String,
    url: String,
    link: String, link_fr: String, link_en: String,
    parent: { type: mongoose_1.Schema.Types.ObjectId, ref: "Bazaar" },
    description: String, description_fr: String, description_en: String,
});
exports.Bazaar = mongoose_1.model("Bazaar", bazaarSchema);
exports.default = exports.Bazaar;
//# sourceMappingURL=model.js.map