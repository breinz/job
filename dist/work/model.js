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
const workSchema = new mongoose_1.Schema({
    title: String, title_fr: String, title_en: String,
    url: String,
    tags: String,
    description: String, description_fr: String, description_en: String,
    pic: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Image",
        set: function (value) {
            old_pic = this.pic;
            return value;
        }
    },
    stat: {
        viewed: { type: Number, default: 0 },
        featured: { type: Number, default: 0 },
        featured_at: Date
    }
});
workSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let work = this;
        if (work.isNew) {
            return next();
        }
        if (work.pic !== old_pic) {
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
workSchema.pre("remove", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let work = this;
        if (work.pic) {
            try {
                let img = yield model_1.default.findById(work.pic);
                img.remove();
            }
            catch (err) {
                return next(err);
            }
        }
        next();
    });
});
workSchema.methods.featured = function () {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        if (this.stat.featured_at > today) {
            return resolve();
        }
        this.stat.featured_at = new Date();
        this.stat.featured++;
        yield this.save();
        resolve();
    }));
};
exports.Work = mongoose_1.model("Work", workSchema);
exports.default = exports.Work;
//# sourceMappingURL=model.js.map