import * as express from "express";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as session from "express-session"
//import SApp from "./back/SApp";
//let flash = require("express-flash")
//import api from "./api"
import userController from "./user/controller";
import adminController from "./admin/controller";
import * as mongoose from "mongoose";
import config from "./config";
import User, { UserModel } from "./user/model";

const app = express();

// The game
//export const gameServer = new SApp();

// View engine
app.set('view engine', 'pug');

// Static content
app.use(express.static(path.join(__dirname, "/public")));

// Cookie parser
app.use(cookieParser());

// Session
app.use(session({ secret: "poipomplop" }))

// Flash messages
//app.use(flash());

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Sub routes
app.use("/users", userController);
app.use("/admin", adminController)

/** Index */
app.get("/", async (req, res) => {

    let users = await User.find();

    res.render("index", { users: users });
    /*if (req.cookies.user) {
        res.render("index")
    } else {
        res.render("join")
    }*/
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
mongoose.connect(config.mongoUri).then(db => {
    console.log(`DB Connected ${config.mongoUri}`)
}).catch(err => {
    console.error(err)
});

export default app;