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
const controller_1 = require("../admin/travels/controller");
const langController_1 = require("../langController");
const router = express.Router();
router.use((req, res, next) => {
    res.locals.menu = "travel";
    res.locals.bc = [[langController_1.t("travels.page-title"), "/travels"]];
    next();
});
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc = [];
    let travels = yield model_1.default.find({ parent: null }).sort({ name: 1 }).populate("pic");
    res.render("travels/index", { travels: travels });
}));
router.get("/all", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc.push(["All"]);
    const items = yield model_1.default.find({ parent: null }).sort({ name: 1 }).populate('pic');
    for (let i = 0; i < items.length; i++) {
        yield controller_1.populateChildren(items[i]);
    }
    res.render("travels/all", { items: items });
}));
router.get("*", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let route = req.path.substr(1).split('/');
    let travel;
    try {
        travel = (yield model_1.default.findOne({ url: route[route.length - 1] }).populate("pic").populate('pics'));
    }
    catch (err) {
        return res.redirect("/travels");
    }
    if (travel === null) {
        return res.redirect("/travels");
    }
    let tree = yield findParents(travel);
    if (tree) {
        let url = "/travels";
        for (let i = 0; i < tree.length; i++) {
            url += `/${tree[i].url}`;
            res.locals.bc.push([langController_1.t(tree[i], "name"), url]);
        }
    }
    res.locals.bc.push([langController_1.t(travel, "name")]);
    let sort = {};
    sort[`name_${langController_1.lang}`] = 1;
    let children = yield model_1.default.find({ parent: travel.id }).sort(sort).populate("pic");
    res.render("travels/travel", { travel: travel, travels: children, path: "/travels" + req.path });
}));
const findParents = (travel, tree = null) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        if (travel.parent) {
            let parent = yield model_1.default.findById(travel.parent);
            if (tree) {
                tree.unshift(parent);
            }
            else {
                tree = [parent];
            }
            resolve(yield findParents(parent, tree));
        }
        else {
            if (tree)
                return resolve(tree);
            resolve();
        }
    }));
};
exports.default = router;
//# sourceMappingURL=controller.js.map