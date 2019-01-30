import * as path from "path"
import express = require("express");
import { Travel, TravelModel } from "../../travels/model";
import { NewData, EditData } from ".";
import validator from "./validator";
import { UploadedFile } from "express-fileupload";
import * as fs from 'fs'
import { mkdir, mv_pic, rm_pic } from "../../utils";
import * as changeCase from "change-case"
import Podcast, { PodcastModel } from "../../podcasts/model";

const PIC_PATH = "img/podcasts"

const url = "admin/bazaar/podcasts";

let router = express.Router();

/**
 * Menu item
 * Breadcrumb
 * Image folder
 */
router.use(async (req, res, next) => {
    res.locals.bc.push(["Podcasts", `/${url}`]);

    await mkdir(PIC_PATH);

    next();

})

/**
 * Index
 */
router.get("/", async (req, res) => {
    res.locals.bc.pop();
    res.locals.bc.push(["Podcasts"]);

    const items = await Podcast.find().sort({ name: 1 }).populate('pic') as [PodcastModel];

    res.render(`${url}/index`, { items: items });
});

/**
 * New form
 */
router.get("/new", async (req, res) => {
    res.locals.bc.push(["New"]);

    res.render(`${url}/new`)
});

/**
 * New logic
 */
router.post("/new", validator.new, async (req, res) => {
    const data: NewData = req.body;

    let podcast = new Podcast() as PodcastModel;

    await populate(podcast, data, req);

    try {
        await podcast.save();
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
    let podcast: PodcastModel;
    try {
        podcast = await Podcast.findById(req.params.id).populate("pic") as PodcastModel;
    } catch (err) {
        return res.redirect("/")
    }
    if (!podcast) return res.redirect("/");

    res.locals.bc.push([podcast.name]);

    res.render(`${url}/edit`, { item: podcast, data: podcast });
});

/**
 * Edit logic
 */
router.post("/:id", validator.edit, async (req, res, next) => {

    let podcast: PodcastModel;
    try {
        podcast = await Podcast.findById(req.params.id) as PodcastModel;
    } catch (err) {
        return next(err)
    }
    if (!podcast) return res.redirect("/");

    const data: EditData = req.body;

    await populate(podcast, data, req);

    try {
        await podcast.save();
    } catch (err) {
        console.log("2");
        return next(err)
    }

    res.redirect(`/${url}`);

});

/**
 * Delete
 */
router.get("/:id/delete", async (req, res, next) => {
    let podcast = await Podcast.findById(req.params.id) as PodcastModel;
    podcast.remove();

    res.redirect(`/${url}`);
});

// --------------------------------------------------
// PRIVATE
// --------------------------------------------------

/**
 * Populate the travel from the form
 * @param podcast 
 * @param data 
 * @param req 
 */
const populate = (podcast: PodcastModel, data: NewData | EditData, req: express.Request) => {
    return new Promise(async (resolve, reject) => {
        podcast.name = data.name;
        podcast.title = data.title;
        podcast.link = data.link;
        podcast.url = changeCase.paramCase(data.name);
        podcast.description = data.description

        if (req.files.pic) {
            let pic = req.files.pic as UploadedFile;

            let pic_id = await mv_pic(`${PIC_PATH}`, pic);

            podcast.pic = pic_id;

            resolve();
        } else {
            resolve();
        }
    })
}

export default router;