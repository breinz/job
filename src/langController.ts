import express = require("express");
import app from "./app"
const json = require("./_lang.json") // in /dist

const router = express.Router();

let lang = "en";

//let json;

/**
 * Lang
 */
app.use((req, res, next) => {
    lang = req.cookies.lang || "fr";
    res.locals.lang = lang;
    res.locals.t = t;
    next();
});

/**
 * Get a translation
 * @param path Path in the json
 */
let t = (path: string) => {
    let arp = path.split(".");
    let phrase = json;
    arp.forEach(p => {
        phrase = phrase[p]
    });
    return phrase[lang];
}

router.get("/:lang", (req, res) => {
    res.cookie("lang", req.params.lang, { maxAge: 1000 * 60 * 60 * 24 * 60 });
    res.redirect(req.get("Referer") || "/");
});

export default router;