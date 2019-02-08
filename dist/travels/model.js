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
let old_pic;
const travelSchema = new mongoose_1.Schema({
    name: String, name_fr: String, name_en: String,
    title: String, title_fr: String, title_en: String,
    url: String,
    parent: { type: mongoose_1.Schema.Types.ObjectId, ref: "Travel" },
    pic: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Image",
        set: function (value) {
            old_pic = this.pic;
            return value;
        }
    },
    pics: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Image" }],
    description: String, description_fr: String, description_en: String
});
travelSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let travel = this;
        if (travel.isNew) {
            return next();
        }
        if (travel.pic !== old_pic) {
            try {
                let img = yield model_1.default.findById(old_pic);
                if (img) {
                    img.remove();
                }
            }
            catch (err) {
                return next(err);
            }
        }
        next();
    });
});
travelSchema.pre("remove", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let travel = this;
        try {
            let img;
            if (travel.pic) {
                img = (yield model_1.default.findById(travel.pic));
                if (img) {
                    img.remove();
                }
            }
            travel.pics.forEach((pic) => __awaiter(this, void 0, void 0, function* () {
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
exports.Travel = mongoose_1.model("Travel", travelSchema);
exports.default = exports.Travel;
//# sourceMappingURL=model.js.map