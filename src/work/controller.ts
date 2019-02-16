import express = require("express");
import Work, { WorkModel } from "./model";
import { t, lang } from "../langController";
import { sort } from "../utils";

const router = express.Router();
const PER_PAGE = 1;

/**
 * Menu item
 * Breadcrumb
 */
router.use((req, res, next) => {
    res.locals.menu = "work";
    res.locals.bc = [[t("work.page-title"), "/work"]];
    next();
})

/**
 * Home
 */
router.get("/", async (req, res) => {
    res.locals.bc = [];

    let total = await Work.estimatedDocumentCount();

    let items = await Work.find().sort(sort(`title_${lang}`)).limit(PER_PAGE).populate("pic") as [WorkModel];

    res.render("work/index", { items: items, total: total, page: 0, PER_PAGE: PER_PAGE });
});

/**
 * Page
 */
router.get(/page:(\d+)/, async (req, res) => {
    res.locals.bc = [];

    let page: number = req.params[0] - 1;

    let total = await Work.estimatedDocumentCount();

    if (page <= 0 || page * PER_PAGE > total) {
        return res.redirect("/work");
    }

    let items = await Work.find().sort(sort(`title_${lang}`)).skip(page * PER_PAGE).limit(PER_PAGE).populate("pic") as [WorkModel];

    res.render("work/index", { items: items, total: total, page: page, PER_PAGE: PER_PAGE });
})

router.get("/tag/:tag", async (req, res) => {
    let tag = req.params.tag;

    res.locals.bc.push(["Tags"], [tag]);

    let items = await Work.find({ "tags": { "$regex": tag, "$options": "i" } }).sort({ title: 1 }).populate("pic") as [WorkModel];

    res.render("work/index", { items: items, tag: tag });
})

/**
 * all
 */
router.get("*", async (req, res, next) => {
    let route = req.path.substr(1).split('/');

    // The current work
    let work: WorkModel;
    try {
        work = await Work.findOne({ url: route[route.length - 1] }).populate("pic") as WorkModel;
    } catch (err) {
        return res.redirect("/work");
    }

    if (!work) {
        return res.redirect("/work");
    }

    if (!req.current_user || !req.current_user.admin) {
        work.stat.viewed++;
        try {
            await work.save();
        } catch (err) {
            next(err);
        }
    }

    res.locals.bc.push([t(work, "title")]);

    res.render("work/item", { item: work });
});

export default router;