"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app_1 = require("./app");
const json = require("./_lang.json");
const router = express.Router();
exports.lang = "en";
app_1.default.use((req, res, next) => {
    exports.lang = req.cookies.lang || "fr";
    res.locals.lang = exports.lang;
    res.locals.t = exports.t;
    next();
});
exports.t = (path_or_obj, field = undefined) => {
    if (typeof path_or_obj == "string") {
        let arp = path_or_obj.split(".");
        let phrase = json;
        arp.forEach(p => {
            phrase = phrase[p];
        });
        return phrase[exports.lang];
    }
    return path_or_obj[`${field}_${exports.lang}`];
};
router.get("/:lang", (req, res) => {
    res.cookie("lang", req.params.lang, { maxAge: 1000 * 60 * 60 * 24 * 60 });
    res.redirect(req.get("Referer") || "/");
});
exports.default = router;
//# sourceMappingURL=langController.js.map