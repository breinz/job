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
const utils_1 = require("../../utils");
const model_2 = require("../../images/model");
let router = express.Router({ mergeParams: true });
let travel;
router.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        travel = (yield model_1.default.findById(req.params.travel_id).populate("pics"));
    }
    catch (err) {
        return next(err);
    }
    if (!travel)
        return next(`Travel not found ${req.params.travel_id}`);
    next();
}));
router.use((req, res, next) => {
    res.locals.bc.push([travel.name, `/admin/travels/${travel.id}`], ["Pictures", `/admin/travels/${travel.id}/pictures`]);
    next();
});
router.get("/", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.pop();
    res.locals.bc.push(["Pictures"]);
    res.render("admin/travels/pics/index", { travel: travel });
}));
router.get("/new", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.push(["New"]);
    res.render("admin/travels/pics/new", { travel: travel });
}));
router.post("/new", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let data = req.body;
    let pic_id = (yield utils_1.mv_pic("img/travels", req.files.pic, data.name, data.description)).id;
    travel.pics.push(pic_id);
    try {
        travel.save();
    }
    catch (error) {
        next(error);
    }
    res.redirect(`/admin/travels/${req.params.travel_id}/pictures`);
}));
router.get("/:id/delete", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        travel.pics.remove(req.params.id);
        travel.save();
    }
    catch (err) {
        next(err);
    }
    let pic;
    try {
        pic = (yield model_2.default.findById(req.params.id));
    }
    catch (err) {
        next(err);
    }
    try {
        yield utils_1.rm_pic(pic);
    }
    catch (err) {
        next(err);
    }
    try {
        yield model_2.default.findByIdAndDelete(req.params.id);
    }
    catch (err) {
        next(err);
    }
    res.redirect(`/admin/travels/${req.params.travel_id}/pictures`);
}));
exports.default = router;
//# sourceMappingURL=picsController.js.map