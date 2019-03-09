"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const model_1 = require("../images/model");
const bazaarSchema = new mongoose_1.Schema({
    title: String, title_fr: String, title_en: String,
    url: String,
    link: String, link_fr: String, link_en: String,
    parent: { type: mongoose_1.Schema.Types.ObjectId, ref: "Bazaar" },
    description: String, description_fr: String, description_en: String,
    pics: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Image" }],
});
bazaarSchema.pre("remove", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("pre remove bazaar");
        let item = this;
        try {
            let img;
            item.pics.forEach((pic) => __awaiter(this, void 0, void 0, function* () {
                img = (yield model_1.default.findById(pic));
                if (img) {
                    img.remove();
                }
            }));
        }
        catch (err) {
            return next(err);
        }
        next();
    });
});
exports.Bazaar = mongoose_1.model("Bazaar", bazaarSchema);
exports.default = exports.Bazaar;
//# sourceMappingURL=model.js.map