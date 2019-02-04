"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app_1 = require("./app");
const json = require("./_lang.json");
const router = express.Router();
let lang = "en";
app_1.default.use((req, res, next) => {
    lang = req.cookies.lang || "fr";
    res.locals.lang = lang;
    res.locals.t = t;
    next();
});
let t = (path) => {
    let arp = path.split(".");
    let phrase = json;
    arp.forEach(p => {
        phrase = phrase[p];
    });
    return phrase[lang];
};
router.get("/:lang", (req, res) => {
    res.cookie("lang", req.params.lang, { maxAge: 1000 * 60 * 60 * 24 * 60 });
    res.redirect(req.get("Referer") || "/");
});
exports.default = router;
//# sourceMappingURL=langController.js.map