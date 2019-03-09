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
const model_2 = require("../podcasts/model");
const langController_1 = require("../langController");
const utils_1 = require("../utils");
const router = express.Router();
router.use((req, res, next) => {
    res.locals.menu = "bazaar";
    res.locals.bc = [["Bazaar", "/bazaar"]];
    next();
});
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.bc = [["Bazaar"]];
    res.locals.bc = [];
    let items = yield model_1.default.find({ parent: null }).sort({ title: 1 });
    res.render("bazaar/index", { items: items });
}));
router.get("/podcasts", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let item = yield model_1.default.findOne({ url: "podcasts" });
    res.locals.bc.push([langController_1.t(item, "title")]);
    let sort = {};
    sort["name_" + langController_1.lang] = 1;
    let list = yield model_2.default.find().sort(sort).populate("pic");
    res.render("bazaar/podcasts/index", { item: item, list: list });
}));
router.get("*", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let route = req.path.substr(1).split('/');
    let item;
    try {
        item = (yield model_1.default.findOne({ url: route[route.length - 1] }).populate("pics"));
    }
    catch (err) {
        return res.redirect("/bazaar");
    }
    if (item === null) {
        return res.redirect("/bazaar");
    }
    item[`description_${langController_1.lang}`] = utils_1.processText(langController_1.t(item, "description"), "/img/bazaar/", item.pics);
    let tree = yield findParents(item);
    if (tree) {
        let url = "/bazaar";
        for (let i = 0; i < tree.length; i++) {
            url += `/${tree[i].url}`;
            res.locals.bc.push([langController_1.t(tree[i], "link"), url]);
        }
    }
    res.locals.bc.push([langController_1.t(item, "link")]);
    let children = yield model_1.default.find({ parent: item.id }).sort({ name: 1 });
    res.render("bazaar/item", { item: item, children: children, path: "/bazaar" + req.path });
}));
const findParents = (item, tree = null) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        if (item.parent) {
            let parent = yield model_1.default.findById(item.parent);
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