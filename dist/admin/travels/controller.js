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
const PIC_PATH = "img/travels";
exports.getAvailableParents = () => __awaiter(this, void 0, void 0, function* () {
    let travels = yield model_1.Travel.find({ parent: null });
    for (let i = 0; i < travels.length; i++) {
        yield populateChildren(travels[i]);
    }
    return travels;
});
const populateChildren = (travel) => __awaiter(this, void 0, void 0, function* () {
    const children = yield model_1.Travel.find({ parent: travel.id }).sort({ name: 1 }).populate('pic');
    travel.children = children;
    for (let i = 0; i < children.length; i++) {
        yield populateChildren(children[i]);
    }
});
let router = express.Router();
router.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    res.locals.menu = "travel";
    res.locals.bc.push(["Travels", "/admin/travels"]);
    yield utils_1.mkdir(PIC_PATH);
    next();
}));
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.pop();
    res.locals.bc.push(["Travels"]);
    const graph = yield model_1.Travel.find({ parent: null }).sort({ name: 1 }).populate('pic');
    for (let i = 0; i < graph.length; i++) {
        yield populateChildren(graph[i]);
    }
    res.render("admin/travels/index", { travels: graph });
}));
router.get("/new", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.push(["New"]);
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
    res.locals.bc.push([travel.name]);
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
router.get("/:id/delete", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield model_1.Travel.findByIdAndDelete(req.params.id);
    res.redirect("/admin/travels");
}));
const populateTravel = (travel, data, req) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        travel.name = data.name;
        travel.title = data.title;
        travel.url = changeCase.paramCase(data.name);
        travel.parent = data.parent || null;
        travel.description = data.description;
        if (req.files.pic) {
            console.log("save pic");
            let pic = req.files.pic;
            let pic_id = yield utils_1.mv_pic(`${PIC_PATH}`, pic);
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