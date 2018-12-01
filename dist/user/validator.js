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
const model_1 = require("./model");
let validator = {};
validator.loggedIn = (req, res, next) => {
    if (!req.current_user) {
        return res.redirect("/users/login");
    }
    next();
};
validator.notLoggedIn = (req, res, next) => {
    if (req.current_user) {
        return res.redirect("/");
    }
    next();
};
validator.signup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let errors = {};
    const data = req.body;
    if (data.login.length === 0) {
        errors.login = "Login required";
    }
    if (!errors.login && data.login.length < 3) {
        errors.login = "Login too short";
    }
    if (data.email.length === 0) {
        errors.email = "Email required";
    }
    if (!errors.email && !data.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        errors.email = "Email is not valid";
    }
    if (!errors.email) {
        let user;
        try {
            user = (yield model_1.default.findOne({ email: data.email }));
            if (user) {
                errors.email = "Email already used for an account";
            }
        }
        catch (err) {
            return next(err);
        }
    }
    if (data.password.length === 0) {
        errors.password = "Password required";
    }
    if (data.password !== data.password2) {
        errors.password2 = "Password don't match";
    }
    if (Object.keys(errors).length > 0) {
        res.render("user/signup", { errors: errors, data: data });
    }
    else {
        next();
    }
});
exports.default = validator;
//# sourceMappingURL=validator.js.map