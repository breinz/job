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
const podcastSchema = new mongoose_1.Schema({
    name: String, name_fr: String, name_en: String,
    link: String,
    url: String,
    description: String, description_fr: String, description_en: String,
    pic: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Image",
        set: function (value) {
            old_pic = this.pic;
            return value;
        }
    }
});
podcastSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let podcast = this;
        if (podcast.isNew) {
            return next();
        }
        if (podcast.pic !== old_pic) {
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
podcastSchema.pre("remove", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let podcast = this;
        if (podcast.pic) {
            try {
                let img = yield model_1.default.findById(podcast.pic);
                img.remove();
            }
            catch (err) {
                return next(err);
            }
        }
        next();
    });
});
exports.Podcast = mongoose_1.model("Podcast", podcastSchema);
exports.default = exports.Podcast;
//# sourceMappingURL=model.js.map