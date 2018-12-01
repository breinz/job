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
const validator_1 = require("./validator");
let router = express.Router();
router.get("/signup", validator_1.default.notLoggedIn, (req, res) => {
    res.render("user/signup");
});
router.post("/signup", validator_1.default.signup, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let user = new model_1.default();
    const data = req.body;
    user.login = data.login;
    user.email = data.email;
    user.password = data.password;
    yield user.save();
    res.redirect("/");
}));
router.get("/login", (req, res) => {
    res.render("user/login");
});
router.post("/login", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const data = req.body;
    const user = yield model_1.default.findOne({ email: data.email });
    if (!user) {
        return res.render("user/login", { error: true });
    }
    user.validPassword(data.password, (err, match, session) => {
        if (err)
            return next(err);
        if (match !== true) {
            return res.render("user/login", { error: true });
        }
        res.cookie("uid", user.id, { maxAge: 1000 * 60 * 60, httpOnly: true });
        res.cookie("usession", session, { maxAge: 1000 * 60 * 60, httpOnly: true });
        return res.redirect("/");
    });
}));
router.get("/logout", (req, res) => {
    res.clearCookie("uid");
    res.clearCookie("usession");
    res.redirect("/");
});
router.get("/:id/delete", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield model_1.default.findByIdAndDelete(req.params.id);
    res.redirect("/");
}));
router.get("/:id/admin", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let user = yield model_1.default.findById(req.params.id);
    user.admin = true;
    yield user.save();
    res.redirect("/");
}));
exports.default = router;
//# sourceMappingURL=controller.js.map