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
router.use((req, res, next) => {
    res.locals.menu = "work";
    res.locals.bc = [[langController_1.t("work.page-title"), "/work"]];
    next();
});
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc = [];
    let items = yield model_1.default.find().sort(utils_1.sort(`title_${langController_1.lang}`)).populate("pic");
    res.render("work/index", { items: items });
}));
router.get("/tag/:tag", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let tag = req.params.tag;
    res.locals.bc.push([tag]);
    let items = yield model_1.default.find({ "tags": { "$regex": tag, "$options": "i" } }).sort({ title: 1 }).populate("pic");
    res.render("work/index", { items: items, tag: tag });
}));
router.get("*", (req, res) => __awaiter(this, void 0, void 0, function* () {
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
    res.locals.bc.push([langController_1.t(work, "title")]);
    res.render("work/item", { item: work });
}));
exports.default = router;
//# sourceMappingURL=controller.js.map