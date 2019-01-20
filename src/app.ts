import * as express from "express";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as session from "express-session"
//import SApp from "./back/SApp";
//let flash = require("express-flash")
//import api from "./api"
import userController from "./user/controller";
import gamesController from "./games/controller";
import travelsController from "./travels/controller";
import bazaarController from "./bazaar/controller";
import adminController from "./admin/controller";
import * as mongoose from "mongoose";
import config from "./config";
import User, { UserModel } from "./user/model";
import Game from "./games/model";
import * as fileUpload from "express-fileupload"
import { getPic } from "./utils";
import { resolve } from "url";

const app = express();

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
})

// Sub routes
app.use("/users", userController);
app.use("/admin", adminController);
app.use("/games", gamesController);
app.use("/travels", travelsController);
app.use("/bazaar", bazaarController);


app.get("/test", (req, res) => {
    res.json("/img/travels/5c3b52a02278b8563122d9d9/e8c3c2fd-4dca-4add-8ef3-eecb2c61e220.JPG");
})

/** Index */
app.get("/", async (req, res) => {

    let users = await User.find();

    const games = await Game.find().setOptions({ sort: { name: 1 } });

    res.render("index", {
        users: users,
        games: games
    });
});

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
    console.log(`DB Connected ${config.mongoUri}`)
}).catch(err => {
    console.error(err)
});

export default app;