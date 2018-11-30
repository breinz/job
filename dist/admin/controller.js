"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const controller_1 = require("./games/controller");
const controller_2 = require("./users/controller");
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
router.use("/games", controller_1.default);
router.use("/users", controller_2.default);
router.get("/", (req, res) => {
    res.render("admin/index");
});
exports.default = router;
//# sourceMappingURL=controller.js.map