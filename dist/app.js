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
const controller_2 = require("./games/controller");
const controller_3 = require("./travels/controller");
const controller_4 = require("./bazaar/controller");
const controller_5 = require("./admin/controller");
const mongoose = require("mongoose");
const config_1 = require("./config");
const model_1 = require("./user/model");
const model_2 = require("./games/model");
const fileUpload = require("express-fileupload");
const utils_1 = require("./utils");
const model_3 = require("./citations/model");
const app = express();
app.locals.basedir = path.join(__dirname, '../views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());
app.use(session({
    secret: "poipomplop",
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use((req, res, next) => {
    res.locals.getImg = utils_1.getPic;
    next();
});
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
app.use((req, res, next) => {
    res.locals.menu = "home";
    res.locals.bc = [[]];
    next();
});
app.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const count = yield model_3.default.count({});
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    const skip = day % count;
    let citation = (yield model_3.default.find().skip(skip).limit(1))[0];
    res.locals.citation = citation ? citation : { content: "" };
    next();
}));
app.use("/users", controller_1.default);
app.use("/admin", controller_5.default);
app.use("/games", controller_2.default);
app.use("/travels", controller_3.default);
app.use("/bazaar", controller_4.default);
app.get("/test", (req, res) => {
    res.json("/img/travels/5c3b52a02278b8563122d9d9/e8c3c2fd-4dca-4add-8ef3-eecb2c61e220.JPG");
});
app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let users = yield model_1.default.find();
    const games = yield model_2.default.find().setOptions({ sort: { name: 1 } });
    res.render("index", {
        users: users,
        games: games
    });
}));
mongoose.connect(config_1.default.mongoUri, { useNewUrlParser: true }).then(db => {
}).catch(err => {
    console.error(err);
});
exports.default = app;
//# sourceMappingURL=app.js.map