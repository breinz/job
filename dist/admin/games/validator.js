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
const model_1 = require("../../games/model");
let validator = {};
validator.new = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let errors = {};
    const data = req.body;
    if (data.name.length === 0) {
        errors.name = " is required";
    }
    let game;
    try {
        game = (yield model_1.default.findOne({ name: data.name }));
        if (game) {
            errors.name = "Name has to be unique";
        }
    }
    catch (err) {
        return next(err);
    }
    if (data.js.length === 0) {
        errors.js = " is required";
    }
    if (Object.keys(errors).length > 0) {
        res.locals.bc.push(["New"]);
        return res.render("admin/games/new", {
            data: data,
            errors: errors
        });
    }
    next();
});
validator.edit = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let errors = {};
    const data = req.body;
    if (data.name.length === 0) {
        errors.name = " is required";
    }
    let game;
    try {
        game = (yield model_1.default.findOne({ name: data.name }));
        if (game && game.id !== req.params.id) {
            errors.name = " has to be unique";
        }
    }
    catch (err) {
        return next(err);
    }
    if (data.js.length === 0) {
        errors.js = "Js is required";
    }
    if (Object.keys(errors).length > 0) {
        let game;
        try {
            game = (yield model_1.default.findById(req.params.id));
        }
        catch (err) {
            res.redirect("/");
        }
        res.locals.bc.push([game.name]);
        return res.render("admin/games/edit", {
            game: game,
            data: data,
            errors: errors
        });
    }
    next();
});
exports.default = validator;
//# sourceMappingURL=validator.js.map