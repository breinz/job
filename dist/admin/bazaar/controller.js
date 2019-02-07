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
const validator_1 = require("./validator");
const changeCase = require("change-case");
const model_1 = require("../../bazaar/model");
const controller_1 = require("../podcasts/controller");
const langController_1 = require("../../langController");
const PIC_PATH = "img/bazaar";
exports.getAvailableParents = () => __awaiter(this, void 0, void 0, function* () {
    let items = yield model_1.default.find({ parent: null });
    for (let i = 0; i < items.length; i++) {
        yield populateChildren(items[i]);
    }
    return items;
});
const populateChildren = (item) => __awaiter(this, void 0, void 0, function* () {
    const children = yield model_1.default.find({ parent: item.id }).sort({ title: 1 });
    item.children = children;
    for (let i = 0; i < children.length; i++) {
        yield populateChildren(children[i]);
    }
});
let router = express.Router();
router.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    res.locals.menu = "bazaar";
    res.locals.bc.push(["Bazaar", "/admin/bazaar"]);
    next();
}));
router.use("/podcasts", controller_1.default);
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.pop();
    res.locals.bc.push(["Bazaar"]);
    const items = yield model_1.default.find({ parent: null }).sort({ title: 1 });
    for (let i = 0; i < items.length; i++) {
        yield populateChildren(items[i]);
    }
    res.render("admin/bazaar/index", { items: items });
}));
router.get("/new", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.push(["New"]);
    console.log(yield exports.getAvailableParents());
    res.render("admin/bazaar/new", { parents: yield exports.getAvailableParents() });
}));
router.post("/new", validator_1.default.new, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = req.body;
    let bazaar = new model_1.default();
    yield populateModel(bazaar, data, req);
    try {
        yield bazaar.save();
    }
    catch (err) {
        return res.render('admin/bazaar/new', {
            data: data,
            error: err,
        });
    }
    res.redirect("/admin/bazaar");
}));
router.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let item;
    try {
        item = (yield model_1.default.findById(req.params.id));
    }
    catch (err) {
        return res.redirect("/");
    }
    if (!item)
        return res.redirect("/");
    res.locals.bc.push([item.title]);
    res.render("admin/bazaar/edit", { item: item, data: item, parents: yield exports.getAvailableParents() });
}));
router.post("/:id", validator_1.default.edit, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let item;
    try {
        item = (yield model_1.default.findById(req.params.id));
    }
    catch (err) {
        return next(err);
    }
    if (!item)
        return res.redirect("/");
    const data = req.body;
    yield populateModel(item, data, req);
    try {
        yield item.save();
    }
    catch (err) {
        console.log("2");
        return next(err);
    }
    res.redirect("/admin/bazaar");
}));
router.get("/:id/delete", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield model_1.default.findByIdAndDelete(req.params.id);
    res.redirect("/admin/bazaar");
}));
const populateModel = (bazaar, data, req) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        bazaar[`title_${langController_1.lang}`] = data.title;
        if (bazaar.url) {
            bazaar.url = data.url;
        }
        else {
            bazaar.url = changeCase.paramCase(data.title);
        }
        bazaar[`link_${langController_1.lang}`] = data.link;
        bazaar.parent = data.parent || null;
        bazaar[`description_${langController_1.lang}`] = data.description;
        resolve();
    }));
};
exports.default = router;
//# sourceMappingURL=controller.js.map