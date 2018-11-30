"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    loggedIn: (req, res, next) => {
        if (!req.current_user) {
            return res.redirect("/users/login");
        }
        next();
    },
    notLoggedIn: (req, res, next) => {
        if (req.current_user) {
            return res.redirect("/");
        }
        next();
    },
    login: (req, res, next) => {
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
    }
};
//# sourceMappingURL=validator.js.map