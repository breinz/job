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
const utils_1 = require("../../utils");
const model_1 = require("../../images/model");
let router = express.Router();
const PIC_PATH = "img/vrac";
router.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.push(["Images", "/admin/images"]);
    yield utils_1.mkdir(PIC_PATH);
    next();
}));
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.pop();
    res.locals.bc.push(["Images"]);
    const items = yield model_1.default.find({ url: `/${PIC_PATH}/` }).sort({ name: 1 });
    res.render("admin/images/index", { items: items });
}));
router.get("/new", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.push(["New"]);
    res.render("admin/images/new");
}));
router.post("/new", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = req.body;
    try {
        let pic = req.files.pic;
        let pic_id = (yield utils_1.mv_pic(`${PIC_PATH}`, pic, data.name, data.description)).id;
    }
    catch (err) {
        return res.render(`admin/images/new`, {
            data: data,
            error: err,
        });
    }
    res.redirect(`/admin/images`);
}));
const populate = (image, data, req) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        image.name = data.name;
        image.description = data.description;
        image.url = PIC_PATH;
        if (req.files.pic) {
            let pic = req.files.pic;
            let pic_id = (yield utils_1.mv_pic(`${PIC_PATH}`, pic)).id;
            resolve();
        }
        else {
            resolve();
        }
    }));
};
exports.default = router;
//# sourceMappingURL=controller.js.map