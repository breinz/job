import express = require("express");
import Work, { WorkModel } from "./model";
import { t } from "../langController";
import { sort } from "../utils";

const router = express.Router();

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
    //res.locals.bc = [["Travels"]];
    res.locals.bc = [];

    let items = await Work.find().sort(sort("title")).populate("pic") as [WorkModel];

    res.render("work/index", { items: items });
});

router.get("/tag/:tag", async (req, res) => {
    let tag = req.params.tag;

    res.locals.bc.push([tag]);

    let items = await Work.find({ "tags": { "$regex": tag, "$options": "i" } }).sort({ title: 1 }).populate("pic") as [WorkModel];

    res.render("work/index", { items: items, tag: tag });
})

/**
 * all
 */
router.get("*", async (req, res) => {
    let route = req.path.substr(1).split('/');

    // The current travel
    let work: WorkModel;
    try {
        work = await Work.findOne({ url: route[route.length - 1] }).populate("pic") as WorkModel;
    } catch (err) {
        return res.redirect("/work");
    }

    if (!work) {
        return res.redirect("/work");
    }

    res.locals.bc.push([work.title]);

    res.render("work/item", { item: work });
});

export default router;