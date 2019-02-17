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
const model_1 = require("./model");
const langController_1 = require("../langController");
const utils_1 = require("../utils");
const router = express.Router();
const PER_PAGE = 5;
router.use((req, res, next) => {
    res.locals.menu = "work";
    res.locals.bc = [[langController_1.t("work.page-title"), "/work"]];
    next();
});
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc = [];
    let total = yield model_1.default.estimatedDocumentCount();
    let items = yield model_1.default.find().sort(utils_1.sort(`title_${langController_1.lang}`)).limit(PER_PAGE).populate("pic");
    res.render("work/index", { items: items, total: total, page: 0, PER_PAGE: PER_PAGE });
}));
router.get(/page:(\d+)/, (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc = [];
    let page = req.params[0] - 1;
    let total = yield model_1.default.estimatedDocumentCount();
    if (page <= 0 || page * PER_PAGE > total) {
        return res.redirect("/work");
    }
    let items = yield model_1.default.find().sort(utils_1.sort(`title_${langController_1.lang}`)).skip(page * PER_PAGE).limit(PER_PAGE).populate("pic");
    res.render("work/index", { items: items, total: total, page: page, PER_PAGE: PER_PAGE });
}));
router.get("/tag/:tag", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let tag = req.params.tag;
    res.locals.bc.push(["Tags"], [tag]);
    let items = yield model_1.default.find({ "tags": { "$regex": tag, "$options": "i" } }).sort({ title: 1 }).populate("pic");
    res.render("work/index", { items: items, tag: tag });
}));
router.get("*", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let route = req.path.substr(1).split('/');
    let work;
    try {
        work = (yield model_1.default.findOne({ url: route[route.length - 1] }).populate("pic"));
    }
    catch (err) {
        return res.redirect("/work");
    }
    if (!work) {
        return res.redirect("/work");
    }
    if (!req.current_user || !req.current_user.admin) {
        work.stat.viewed++;
        try {
            yield work.save();
        }
        catch (err) {
            next(err);
        }
    }
    res.locals.bc.push([langController_1.t(work, "title")]);
    res.render("work/item", {
        item: work,
        seo: work.seo
    });
}));
exports.default = router;
//# sourceMappingURL=controller.js.map