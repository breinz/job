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
const model_1 = require("../../bazaar/model");
const controller_1 = require("./controller");
let validator = {};
validator.new = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let errors = {};
    const data = req.body;
    if (data.title.length === 0) {
        errors.title = " is required";
    }
    if (Object.keys(errors).length > 0) {
        return res.render("admin/bazaar/new", {
            data: data,
            errors: errors,
        });
    }
    next();
});
validator.edit = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let errors = {};
    const data = req.body;
    if (data.title.length === 0) {
        errors.title = " is required";
    }
    if (Object.keys(errors).length > 0) {
        let item;
        try {
            item = (yield model_1.default.findById(req.params.id));
        }
        catch (err) {
            res.redirect("/");
        }
        return res.render("admin/bazaar/edit", {
            item: item,
            data: data,
            errors: errors,
            parents: yield controller_1.getAvailableParents()
        });
    }
    next();
});
exports.default = validator;
//# sourceMappingURL=validator.js.map