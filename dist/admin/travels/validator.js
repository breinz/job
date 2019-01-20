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
const model_1 = require("../../travels/model");
const controller_1 = require("./controller");
let validator = {};
validator.new = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let errors = {};
    const data = req.body;
    if (data.name.length === 0) {
        errors.name = "Name is required";
    }
    let travel;
    try {
        travel = (yield model_1.default.findOne({ name: data.name }));
        if (travel) {
            errors.name = "Name has to be unique";
        }
    }
    catch (err) {
        return next(err);
    }
    if (Object.keys(errors).length > 0) {
        return res.render("admin/travels/new", {
            data: data,
            errors: errors,
            parents: yield controller_1.getAvailableParents()
        });
    }
    next();
});
validator.edit = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let errors = {};
    const data = req.body;
    if (data.name.length === 0) {
        errors.name = "Name is required";
    }
    let travel;
    try {
        travel = (yield model_1.default.findOne({ name: data.name }));
        if (travel && travel.id !== req.params.id) {
            errors.name = "Name has to be unique";
        }
    }
    catch (err) {
        return next(err);
    }
    if (Object.keys(errors).length > 0) {
        let travel;
        try {
            travel = (yield model_1.default.findById(req.params.id));
        }
        catch (err) {
            res.redirect("/");
        }
        return res.render("admin/travels/edit", {
            travel: travel,
            data: data,
            errors: errors
        });
    }
    next();
});
exports.default = validator;
//# sourceMappingURL=validator.js.map