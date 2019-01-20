"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const controller_1 = require("./games/controller");
const controller_2 = require("./users/controller");
const controller_3 = require("./travels/controller");
const controller_4 = require("./bazaar/controller");
let router = express.Router();
router.use((req, res, next) => {
    if (!req.current_user) {
        return res.redirect('/');
    }
    if (!req.current_user.admin) {
        return res.redirect('/');
    }
    next();
});
router.use((req, res, next) => {
    res.locals.bc = [["Admin", "/admin"]];
    next();
});
router.use("/games", controller_1.default);
router.use("/users", controller_2.default);
router.use("/travels", controller_3.default);
router.use("/bazaar", controller_4.default);
router.get("/", (req, res) => {
    res.render("admin/index");
});
exports.default = router;
//# sourceMappingURL=controller.js.map