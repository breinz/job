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
const model_4 = require("./travels/model");
const model_5 = require("./podcasts/model");
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
    const day = utils_1.dayOfYear();
    const skip = day % count;
    let citation = (yield model_3.default.find().skip(skip).limit(1))[0];
    res.locals.citation = citation ? citation : { content: "" };
    next();
}));
app.use((req, res, next) => {
    res.locals.format = utils_1.formatText;
    next();
});
app.use("/users", controller_1.default);
app.use("/admin", controller_5.default);
app.use("/games", controller_2.default);
app.use("/travels", controller_3.default);
app.use("/bazaar", controller_4.default);
app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let travels_count = yield model_4.default.estimatedDocumentCount();
    let index = (utils_1.dayOfYear() * 3 + 2) % travels_count;
    let travel = (yield model_4.default.find().skip(index).limit(1).populate("pic"))[0];
    let podcast_count = yield model_5.default.estimatedDocumentCount();
    const podcast_index = (utils_1.dayOfYear() * 3 + 2) % podcast_count;
    let podcast = (yield model_5.default.find().skip(podcast_index).limit(1).populate("pic"))[0];
    let users = yield model_1.default.find();
    const games = yield model_2.default.find().setOptions({ sort: { name: 1 } });
    res.render("index", {
        users: users,
        games: games,
        travel: travel,
        podcast: podcast
    });
}));
mongoose.connect(config_1.default.mongoUri, { useNewUrlParser: true }).then(db => {
}).catch(err => {
    console.error(err);
});
exports.default = app;
//# sourceMappingURL=app.js.map