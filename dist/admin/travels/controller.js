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
const model_1 = require("../../travels/model");
const validator_1 = require("./validator");
const utils_1 = require("../../utils");
const changeCase = require("change-case");
const picsController_1 = require("./picsController");
const langController_1 = require("../../langController");
const PIC_PATH = "img/travels";
exports.getAvailableParents = () => __awaiter(this, void 0, void 0, function* () {
    let travels = yield model_1.Travel.find({ parent: null });
    for (let i = 0; i < travels.length; i++) {
        yield exports.populateChildren(travels[i]);
    }
    return travels;
});
exports.populateChildren = (travel) => __awaiter(this, void 0, void 0, function* () {
    let sort = {};
    sort[`name_${langController_1.lang}`];
    const children = yield model_1.Travel.find({ parent: travel.id }).sort(sort).populate('pic');
    travel.children = children;
    for (let i = 0; i < children.length; i++) {
        yield exports.populateChildren(children[i]);
    }
});
let router = express.Router();
router.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    res.locals.menu = "travel";
    res.locals.bc.push([langController_1.t("travels.page-title"), "/admin/travels"]);
    yield utils_1.mkdir(PIC_PATH);
    next();
}));
router.use("/:travel_id/pictures", picsController_1.default);
router.get("/migrate", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let travels = yield model_1.Travel.find();
    for (let i = 0; i < travels.length; i++) {
        const travel = travels[i];
        if (travel.name_en && travel.name_en !== "")
            continue;
        travel.name_en = travel.name;
        travel.title_en = travel.title;
        travel.description_en = travel.description;
        yield travel.save();
    }
    res.redirect("/admin/travels");
}));
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.pop();
    res.locals.bc.push([langController_1.t("travels.page-title")]);
    let sort = {};
    sort[`name_${langController_1.lang}`];
    const graph = yield model_1.Travel.find({ parent: null }).sort(sort).populate('pic');
    for (let i = 0; i < graph.length; i++) {
        yield exports.populateChildren(graph[i]);
    }
    res.render("admin/travels/index", { travels: graph });
}));
router.get("/new", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.push([langController_1.t("admin.new")]);
    res.render("admin/travels/new", { parents: yield exports.getAvailableParents() });
}));
router.post("/new", validator_1.default.new, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = req.body;
    let travel = new model_1.Travel();
    yield populateTravel(travel, data, req);
    try {
        yield travel.save();
    }
    catch (err) {
        return res.render('admin/travels/new', {
            data: data,
            error: err,
            parents: yield exports.getAvailableParents()
        });
    }
    res.redirect("/admin/travels");
}));
router.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let travel;
    try {
        travel = (yield model_1.Travel.findById(req.params.id).populate("pic"));
    }
    catch (err) {
        return res.redirect("/");
    }
    if (!travel)
        return res.redirect("/");
    res.locals.bc.push([travel[`name_${langController_1.lang}`]]);
    res.render("admin/travels/edit", { travel: travel, data: travel, parents: yield exports.getAvailableParents() });
}));
router.post("/:id", validator_1.default.edit, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let travel;
    try {
        travel = (yield model_1.Travel.findById(req.params.id));
    }
    catch (err) {
        return next(err);
    }
    if (!travel)
        return res.redirect("/");
    const data = req.body;
    yield populateTravel(travel, data, req);
    try {
        yield travel.save();
    }
    catch (err) {
        console.log("2");
        return next(err);
    }
    res.redirect("/admin/travels");
}));
router.get("/:id/delete", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let travel = yield model_1.Travel.findById(req.params.id);
    travel.remove();
    res.redirect("/admin/travels");
}));
const populateTravel = (travel, data, req) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        travel[`name_${langController_1.lang}`] = data.name;
        travel[`title_${langController_1.lang}`] = data.title;
        travel[`description_${langController_1.lang}`] = data.description;
        travel.seo[`title_${langController_1.lang}`] = data.seo_title;
        travel.seo[`keywords_${langController_1.lang}`] = data.seo_keywords;
        travel.seo[`description_${langController_1.lang}`] = data.seo_description;
        if (!travel.url || langController_1.lang == "en") {
            travel.url = changeCase.paramCase(data.name);
        }
        travel.parent = data.parent || null;
        if (req.files.pic) {
            let pic = req.files.pic;
            let pic_id = (yield utils_1.mv_pic(`${PIC_PATH}`, pic)).id;
            travel.pic = pic_id;
            resolve();
        }
        else {
            resolve();
        }
    }));
};
exports.default = router;
//# sourceMappingURL=controller.js.map