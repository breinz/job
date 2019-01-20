"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const imageSchema = new mongoose_1.Schema({
    name: String,
    file: String,
    url: String
});
imageSchema.statics.original = function () {
    return this.url + this.file;
};
exports.Image = mongoose_1.model("Image", imageSchema);
exports.default = exports.Image;
//# sourceMappingURL=model.js.map