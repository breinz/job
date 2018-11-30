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
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const controller_1 = require("./user/controller");
const mongoose = require("mongoose");
const config_1 = require("./config");
const model_1 = require("./user/model");
const app = express();
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());
app.use(session({ secret: "poipomplop" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let user = yield model_1.default.findById(req.cookies.uid);
    if (!user)
        return next();
    user.validSession(req.cookies.usession, (err, isMatch) => {
        if (err)
            return next(err);
        if (isMatch !== true) {
            return next();
        }
        req.current_user = user;
        res.locals.current_user = user;
        next();
    });
}));
app.use("/users", controller_1.default);
app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let users = yield model_1.default.find();
    res.render("index", { users: users });
}));
mongoose.connect(config_1.default.mongoUri).then(db => {
    console.log(`DB Connected ${config_1.default.mongoUri}`);
}).catch(err => {
    console.error(err);
});
exports.default = app;
//# sourceMappingURL=app.js.map