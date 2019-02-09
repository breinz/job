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
const utils_1 = require("../../utils");
const changeCase = require("change-case");
const model_1 = require("../../work/model");
const langController_1 = require("../../langController");
const PIC_PATH = "img/work";
const url = "admin/work";
let router = express.Router();
router.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    res.locals.menu = "work";
    res.locals.bc.push([langController_1.t("work.page-title"), `/${url}`]);
    yield utils_1.mkdir(PIC_PATH);
    next();
}));
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.pop();
    res.locals.bc.push([langController_1.t("work.page-title")]);
    const items = yield model_1.default.find().sort(utils_1.sort(`title_${langController_1.lang}`)).populate('pic');
    res.render(`${url}/index`, { items: items });
}));
router.get("/new", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.push([langController_1.t("admin.new")]);
    res.render(`${url}/new`);
}));
router.post("/new", validator_1.default.new, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = req.body;
    let work = new model_1.default();
    yield populate(work, data, req);
    try {
        yield work.save();
    }
    catch (err) {
        return res.render(`${url}/new`, {
            data: data,
            error: err,
        });
    }
    res.redirect(`/${url}`);
}));
router.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let work;
    try {
        work = (yield model_1.default.findById(req.params.id).populate("pic"));
    }
    catch (err) {
        return res.redirect("/");
    }
    if (!work)
        return res.redirect("/");
    res.locals.bc.push([work[`title_${langController_1.lang}`]]);
    res.render(`${url}/edit`, { item: work, data: work });
}));
router.post("/:id", validator_1.default.edit, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let work;
    try {
        work = (yield model_1.default.findById(req.params.id));
    }
    catch (err) {
        return next(err);
    }
    if (!work)
        return res.redirect("/");
    const data = req.body;
    yield populate(work, data, req);
    try {
        yield work.save();
    }
    catch (err) {
        return next(err);
    }
    res.redirect(`/${url}`);
}));
router.get("/:id/delete", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let work = yield model_1.default.findById(req.params.id);
    work.remove();
    res.redirect(`/${url}`);
}));
const populate = (work, data, req) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        work[`title_${langController_1.lang}`] = data.title;
        if (!work.url || langController_1.lang === "en") {
            work.url = changeCase.paramCase(data.title);
        }
        let tags = data.tags.split(",").map(value => { return changeCase.kebab(value); });
        work.tags = tags.join(",");
        work[`description_${langController_1.lang}`] = data.description;
        if (req.files.pic) {
            let pic = req.files.pic;
            let pic_id = yield utils_1.mv_pic(`${PIC_PATH}`, pic);
            work.pic = pic_id;
            resolve();
        }
        else {
            resolve();
        }
    }));
};
exports.default = router;
//# sourceMappingURL=controller.js.map