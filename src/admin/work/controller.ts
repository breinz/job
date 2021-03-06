import * as path from "path"
import express = require("express");
import { Travel, TravelModel } from "../../travels/model";
import { NewData, EditData } from ".";
import validator from "./validator";
import { UploadedFile } from "express-fileupload";
import * as fs from 'fs'
import { mkdir, mv_pic, sort } from "../../utils";
import * as changeCase from "change-case"
import Podcast, { PodcastModel } from "../../podcasts/model";
import Work, { WorkModel } from "../../work/model";
import { Types } from "mongoose";
import { lang, t } from "../../langController";

const PIC_PATH = "img/work"

const url = "admin/work";

let router = express.Router();

/**
 * Menu item
 * Breadcrumb
 * Image folder
 */
router.use(async (req, res, next) => {
    res.locals.menu = "work";
    res.locals.bc.push([t("work.page-title"), `/${url}`]);

    await mkdir(PIC_PATH);

    next();

});

/**
 * Index
 */
router.get("/", async (req, res) => {
    res.locals.bc.pop();
    res.locals.bc.push([t("work.page-title")]);

    const items = await Work.find().sort(sort(`title_${lang}`)).populate('pic') as [WorkModel];

    res.render(`${url}/index`, { items: items });
});

/**
 * Create a new work
 */
router.post("/", async (req, res) => {
    const data: NewData = req.body;

    let work = new Work() as WorkModel;

    work[`title_${lang}`] = data.title;

    try {
        await work.save();
    } catch (err) {
        return res.render(`${url}/new`, {
            data: data,
            error: err,
        });
    }

    res.redirect(`/admin/work/${work.id}`);
});

/**
 * New form
 */
router.get("/new", async (req, res) => {
    res.locals.bc.push([t("admin.new")]);

    res.render(`${url}/new`)
});

/**
 * New logic
 */
router.post("/new", validator.new, async (req, res) => {
    const data: NewData = req.body;

    let work = new Work() as WorkModel;

    await populate(work, data, req);

    try {
        await work.save();
    } catch (err) {
        return res.render(`${url}/new`, {
            data: data,
            error: err,
        });
    }

    res.redirect(`/${url}`);
});

/**
 * Edit form
 */
router.get("/:id", async (req, res) => {
    let work: WorkModel;
    try {
        work = await Work.findById(req.params.id).populate("pic").populate("pics") as WorkModel;
    } catch (err) {
        return res.redirect("/")
    }
    if (!work) return res.redirect("/");

    res.locals.bc.push([work[`title_${lang}`]]);

    res.render(`${url}/edit`, { item: work, data: work });
});

/**
 * Ajax
 * Add on inline image to use in description
 */
router.post("/:id/add_inline_pic", async (req, res, next) => {
    // Find the Work
    let work: WorkModel;
    try {
        work = await Work.findById(req.params.id) as WorkModel;
    } catch (err) {
        return res.send("ERROR!")
    }
    if (!work) return res.send("ERROR!!");


    console.log("try upload ajax");
    //console.log(req);
    let file = req.files.file as UploadedFile;
    console.log(file.name);

    let pic = await mv_pic(PIC_PATH, file);

    work.pics.push(pic.id);

    try {
        work.save();
    } catch (err) {
        return res.send("ERROR!!!");
    }

    res.send(`/${PIC_PATH}/${pic.fileName}`);
});

/**
 * Edit logic
 */
router.post("/:id", validator.edit, async (req, res, next) => {

    let work: WorkModel;
    try {
        work = await Work.findById(req.params.id) as WorkModel;
    } catch (err) {
        return next(err)
    }
    if (!work) return res.redirect("/");

    const data: EditData = req.body;

    await populate(work, data, req);

    try {
        await work.save();
    } catch (err) {
        return next(err)
    }

    res.redirect(`/${url}`);
});

/**
 * Delete
 */
router.get("/:id/delete", async (req, res, next) => {
    let work = await Work.findById(req.params.id) as WorkModel;
    work.remove();

    res.redirect(`/${url}`);
});

// --------------------------------------------------
// PRIVATE
// --------------------------------------------------

/**
 * Populate the work from the form
 * @param work 
 * @param data 
 * @param req 
 */
const populate = (work: WorkModel, data: NewData | EditData, req: express.Request) => {
    return new Promise(async (resolve, reject) => {
        work[`title_${lang}`] = data.title;
        work.seo[`title_${lang}`] = data.seo_title;
        work.seo[`description_${lang}`] = data.seo_description;
        work.seo[`keywords_${lang}`] = data.seo_keywords;

        if (!work.url || lang === "en") {
            work.url = changeCase.paramCase(data.title);
        }
        let tags = data.tags.split(",").map(value => { return changeCase.kebab(value) })
        work.tags = tags.join(",");
        work[`description_${lang}`] = data.description;

        if (req.files.pic) {
            let pic = req.files.pic as UploadedFile;

            let pic_id = (await mv_pic(`${PIC_PATH}`, pic)).id;

            work.pic = pic_id;

            resolve();
        } else {
            resolve();
        }
    })
}

export default router;