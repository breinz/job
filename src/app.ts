import * as express from "express";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as session from "express-session"
//import SApp from "./back/SApp";
//let flash = require("express-flash")
//import api from "./api"

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

// Sub routes
//app.use("/api", api)

/** Index */
app.get("/", (req, res) => {
    res.render("index");
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

export default app;