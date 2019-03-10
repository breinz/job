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
const model_2 = require("./games/model");
const fileUpload = require("express-fileupload");
const utils_1 = require("./utils");
const model_3 = require("./citations/model");
const model_4 = require("./travels/model");
const model_5 = require("./podcasts/model");
const iplocation_1 = require("iplocation");
const app = express();
exports.default = app;
app.enable('trust proxy');
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
const langController_1 = require("./langController");
const controller_2 = require("./admin/controller");
const controller_3 = require("./games/controller");
const controller_4 = require("./travels/controller");
const controller_5 = require("./bazaar/controller");
const controller_6 = require("./work/controller");
const model_6 = require("./work/model");
const model_7 = require("./stats/model");
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
app.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    res.locals.ips = [req.ip, req.headers['x-real-ip'] || req.connection.remoteAddress];
    console.log(req.ip, req.ips);
    if (req.path.indexOf("/admin") === 0) {
        return next();
    }
    let stat = new model_7.default();
    stat.path = req.path;
    stat.ip = req.ip;
    stat.date = new Date();
    try {
        let ip = yield iplocation_1.default(req.ip, []);
        stat.city = ip.city;
        stat.country = ip.country;
        stat.countryCode = ip.countryCode;
        stat.region = ip.region;
        stat.regionName = ip.regionCode;
    }
    catch (error) {
    }
    yield stat.save();
    next();
}));
app.use("/lang", langController_1.default);
app.use("/users", controller_1.default);
app.use("/admin", controller_2.default);
app.use("/games", controller_3.default);
app.use("/travels", controller_4.default);
app.use("/bazaar", controller_5.default);
app.use("/work", controller_6.default);
app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const doy = utils_1.dayOfYear();
    let travels_count = yield model_4.default.estimatedDocumentCount();
    let step = travels_count / 3;
    step = Math.round(step) == step ? step + 1 : Math.round(step);
    let index = (doy * step) % travels_count;
    let travel = (yield model_4.default.find().skip(index).limit(1).populate("pic"))[0];
    yield travel.featured();
    let podcast_count = yield model_5.default.estimatedDocumentCount();
    step = podcast_count / 3;
    step = Math.round(step) == step ? step + 1 : Math.round(step);
    const podcast_index = (doy * step) % podcast_count;
    let podcast = (yield model_5.default.find().skip(podcast_index).limit(1).populate("pic"))[0];
    yield podcast.featured();
    let work_count = yield model_6.default.estimatedDocumentCount();
    step = work_count / 3;
    step = Math.round(step) == step ? step + 1 : Math.round(step);
    const work_index = (doy * step) % work_count;
    let work = (yield model_6.default.find().skip(work_index).limit(1).populate("pic"))[0];
    yield work.featured();
    let users = yield model_1.default.find();
    const games = yield model_2.default.find().setOptions({ sort: { name: 1 } });
    res.render("index", {
        users: users,
        games: games,
        travel: travel,
        podcast: podcast,
        work: work
    });
}));
app.get("/cv", (req, res) => {
    res.render("cv");
});
mongoose.connect(config_1.default.mongoUri, { useNewUrlParser: true }).then(db => {
}).catch(err => {
    console.error(err);
});
//# sourceMappingURL=app.js.map