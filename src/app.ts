import * as express from "express";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as session from "express-session"
import userController from "./user/controller";
import * as mongoose from "mongoose";
import config from "./config";
import User, { UserModel } from "./user/model";
import Game from "./games/model";
import * as fileUpload from "express-fileupload"
import { getPic, formatText, shuffle, dayOfYear, mv_pic } from "./utils";
import Citation, { CitationModel } from "./citations/model";
import Travel, { TravelModel } from "./travels/model";
import Podcast, { PodcastModel } from "./podcasts/model";
import iplocation from "iplocation";
//let expressIp = require("express-ip");

const app = express();
export default app;

//app.set('trust proxy', true);
app.enable('trust proxy')
//app.use(expressIp().getIpInfoMiddleware);

// The game
//export const gameServer = new SApp();

// Base dir for views
app.locals.basedir = path.join(__dirname, '../views');
// View engine
app.set('view engine', 'pug');

// Static content
app.use(express.static(path.join(__dirname, "../public")));

// Cookie parser
app.use(cookieParser());

// Session
app.use(session({
    secret: "poipomplop",
    resave: true,
    saveUninitialized: true
}));

// Flash messages
//app.use(flash());

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import langController from "./langController"
import adminController from "./admin/controller";
import gamesController from "./games/controller";
import travelsController from "./travels/controller";
import bazaarController from "./bazaar/controller";
import workController from "./work/controller";
import Work, { WorkModel } from "./work/model";
import Stat, { StatModel } from "./stats/model";

// express-fileupload
app.use(fileUpload());
app.use((req, res, next) => {
    res.locals.getImg = getPic;
    next();
})

/**
 * Check if a user is logged in
 */
app.use(async (req, res, next) => {

    let user = await User.findById(req.cookies.uid) as UserModel;
    if (!user) return next();


    user.validSession(req.cookies.usession, (err, isMatch) => {
        if (err) return next(err);
        if (isMatch !== true) {
            return next();
        }
        req.current_user = user;
        res.locals.current_user = user;
        next();
    });
});

/**
 * Menu item
 * Breadcrumb
 */
app.use((req, res, next) => {
    res.locals.menu = "home";
    res.locals.bc = [[]];
    next();
});

/**
 * Citation
 */
app.use(async (req, res, next) => {
    const count = await Citation.count({});

    // Get the day of the year
    const day = dayOfYear();
    //const now: any = new Date();
    //const start: any = new Date(now.getFullYear(), 0, 0);
    //const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    //const oneDay = 1000 * 60 * 60 * 24;
    //const day = Math.floor(diff / oneDay);

    const skip = day % count;

    let citation = (await Citation.find().skip(skip).limit(1))[0] as CitationModel;

    res.locals.citation = citation ? citation : { content: "" };

    next();
});

/**
 * Text format
 */
app.use((req, res, next) => {
    res.locals.format = formatText;
    next();
});

/** 
 * Stat
 */
app.use(async (req, res, next) => {
    res.locals.ips = [req.ip, req.headers['x-real-ip'] || req.connection.remoteAddress];
    console.log(req.ip, req.ips);
    //console.log(req.ipInfos);
    if (req.path.indexOf("/admin") === 0) {
        return next();
    }
    let stat = new Stat() as StatModel;
    stat.path = req.path;
    stat.ip = req.ip;
    stat.date = new Date();
    try {
        let ip = await iplocation(req.ip, [])
        stat.city = ip.city;
        stat.country = ip.country;
        stat.countryCode = ip.countryCode;
        stat.region = ip.region;
        stat.regionName = ip.regionCode;
    } catch (error) {

    }
    await stat.save();

    next();
});

// Sub routes
app.use("/lang", langController);
app.use("/users", userController);
app.use("/admin", adminController);
app.use("/games", gamesController);
app.use("/travels", travelsController);
app.use("/bazaar", bazaarController);
app.use("/work", workController);

/*app.get("/test", (req, res) => {
    res.json("/img/travels/5c3b52a02278b8563122d9d9/e8c3c2fd-4dca-4add-8ef3-eecb2c61e220.JPG");
})*/

/** Index */
app.get("/", async (req, res) => {
    const doy = dayOfYear();

    // Feature travel
    let travels_count = await Travel.estimatedDocumentCount();
    let step = travels_count / 3;
    step = Math.round(step) == step ? step + 1 : Math.round(step);
    let index = (doy * step) % travels_count;
    let travel = (await Travel.find().skip(index).limit(1).populate("pic"))[0] as TravelModel;
    await travel.featured();

    // Feature podcast
    let podcast_count = await Podcast.estimatedDocumentCount();
    step = podcast_count / 3;
    step = Math.round(step) == step ? step + 1 : Math.round(step);
    const podcast_index = (doy * step) % podcast_count;
    let podcast = (await Podcast.find().skip(podcast_index).limit(1).populate("pic"))[0] as PodcastModel;
    await podcast.featured();

    // Feature work
    let work_count = await Work.estimatedDocumentCount();
    step = work_count / 3;
    step = Math.round(step) == step ? step + 1 : Math.round(step);
    const work_index = (doy * step) % work_count;
    let work = (await Work.find().skip(work_index).limit(1).populate("pic"))[0] as WorkModel;
    await work.featured();

    let users = await User.find();

    const games = await Game.find().setOptions({ sort: { name: 1 } });

    res.render("index", {
        users: users,
        games: games,
        travel: travel,
        podcast: podcast,
        work: work
    });
});

/**
 * CV
 */
app.get("/cv", (req, res) => {
    res.render("cv");
})

/**
 * Join a game
 */
/*app.post("/join", (req, res) => {
    if (!req.body.name) {
        req.flash("error", "Please provide a name")
        return res.redirect("/");
    }

    // Tells the game that a new user joins
    const uuid = gameServer.join(req.body.name);

    res.cookie('user', uuid, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true })
    res.redirect("/")
})*/

// Mongoose connect
mongoose.connect(config.mongoUri, { useNewUrlParser: true }).then(db => {
    //console.log(`DB Connected ${config.mongoUri}`)
}).catch(err => {
    console.error(err)
});

//export default app;