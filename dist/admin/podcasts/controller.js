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
const model_1 = require("../../podcasts/model");
const langController_1 = require("../../langController");
const PIC_PATH = "img/podcasts";
const url = "admin/bazaar/podcasts";
let router = express.Router();
router.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.push(["Podcasts", `/${url}`]);
    yield utils_1.mkdir(PIC_PATH);
    next();
}));
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.pop();
    res.locals.bc.push(["Podcasts"]);
    const items = yield model_1.default.find().sort({ name: 1 }).populate('pic');
    res.render(`${url}/index`, { items: items });
}));
router.get("/new", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.push(["New"]);
    res.render(`${url}/new`);
}));
router.post("/new", validator_1.default.new, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = req.body;
    let podcast = new model_1.default();
    yield populate(podcast, data, req);
    try {
        yield podcast.save();
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
    let podcast;
    try {
        podcast = (yield model_1.default.findById(req.params.id).populate("pic"));
    }
    catch (err) {
        return res.redirect("/");
    }
    if (!podcast)
        return res.redirect("/");
    res.locals.bc.push([langController_1.t(podcast, "name")]);
    res.render(`${url}/edit`, { item: podcast, data: podcast });
}));
router.post("/:id", validator_1.default.edit, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let podcast;
    try {
        podcast = (yield model_1.default.findById(req.params.id));
    }
    catch (err) {
        return next(err);
    }
    if (!podcast)
        return res.redirect("/");
    const data = req.body;
    yield populate(podcast, data, req);
    try {
        yield podcast.save();
    }
    catch (err) {
        console.log("2");
        return next(err);
    }
    res.redirect(`/${url}`);
}));
router.get("/:id/delete", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let podcast = yield model_1.default.findById(req.params.id);
    podcast.remove();
    res.redirect(`/${url}`);
}));
const populate = (podcast, data, req) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        podcast[`name_${langController_1.lang}`] = data.name;
        podcast.link = data.link;
        podcast.url = changeCase.paramCase(data.name);
        podcast[`description_${langController_1.lang}`] = data.description;
        if (req.files.pic) {
            let pic = req.files.pic;
            let pic_id = (yield utils_1.mv_pic(`${PIC_PATH}`, pic)).id;
            podcast.pic = pic_id;
            resolve();
        }
        else {
            resolve();
        }
    }));
};
exports.default = router;
//# sourceMappingURL=controller.js.map