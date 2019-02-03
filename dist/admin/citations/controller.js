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
const express = require("express");
const model_1 = require("../../citations/model");
const validator_1 = require("./validator");
let router = express.Router();
router.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    res.locals.menu = "citation";
    res.locals.bc.push(["Citations", "/admin/citations"]);
    next();
}));
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.pop();
    res.locals.bc.push(["Citations"]);
    const items = yield model_1.Citation.find();
    res.render("admin/citations/index", { items: items });
}));
router.get("/new", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.push(["New"]);
    res.render("admin/citations/new");
}));
router.post("/new", validator_1.default.new, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = req.body;
    let citation = new model_1.Citation();
    citation.content = data.content;
    citation.source = data.source;
    try {
        yield citation.save();
    }
    catch (err) {
        return res.render('admin/citations/new', {
            data: data,
            error: err,
        });
    }
    res.redirect("/admin/citations");
}));
router.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let citation;
    try {
        citation = (yield model_1.Citation.findById(req.params.id));
    }
    catch (err) {
        return res.redirect("/");
    }
    if (!citation)
        return res.redirect("/");
    res.locals.bc.push(["Edit"]);
    res.render("admin/citations/edit", { item: citation, data: citation });
}));
router.post("/:id", validator_1.default.edit, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let citation;
    try {
        citation = (yield model_1.Citation.findById(req.params.id));
    }
    catch (err) {
        return next(err);
    }
    if (!citation)
        return res.redirect("/");
    const data = req.body;
    citation.content = data.content;
    citation.source = data.source;
    try {
        yield citation.save();
    }
    catch (err) {
        return next(err);
    }
    res.redirect("/admin/citations");
}));
router.get("/:id/delete", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield model_1.Citation.findByIdAndDelete(req.params.id);
    res.redirect("/admin/citations");
}));
exports.default = router;
//# sourceMappingURL=controller.js.map