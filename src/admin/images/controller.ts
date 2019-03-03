import * as path from "path"
import express = require("express");
import { Travel, TravelModel } from "../../travels/model";
//import { NewData, EditData } from ".";
//import validator from "./validator";
import { UploadedFile } from "express-fileupload";
import * as fs from 'fs'
import { mkdir, mv_pic, rm_pic } from "../../utils";
import * as changeCase from "change-case"
import Podcast, { PodcastModel } from "../../podcasts/model";
import Image, { ImageModel } from "../../images/model";
import { NewData } from ".";

let router = express.Router();

const PIC_PATH = "img/vrac";

/**
 * Menu item
 * Breadcrumb
 * Image folder
 */
router.use(async (req, res, next) => {
    res.locals.bc.push(["Images", "/admin/images"]);

    await mkdir(PIC_PATH);

    next();
});

/**
 * Index
 */
router.get("/", async (req, res) => {
    res.locals.bc.pop();
    res.locals.bc.push(["Images"]);

    const items = await Image.find({ url: `/${PIC_PATH}/` }).sort({ name: 1 }) as [ImageModel];

    res.render("admin/images/index", { items: items });
});

/**
 * New form
 */
router.get("/new", async (req, res) => {
    res.locals.bc.push(["New"]);

    res.render("admin/images/new")
});

/**
 * New logic
 */
router.post("/new", /*validator.new,*/ async (req, res) => {
    const data: NewData = req.body;

    try {
        let pic = req.files.pic as UploadedFile;
        let pic_id = (await mv_pic(`${PIC_PATH}`, pic, data.name, data.description)).id;
    } catch (err) {
        return res.render(`admin/images/new`, {
            data: data,
            error: err,
        });
    }

    /*let image = new Image() as ImageModel;

    await populate(image, data, req);

    try {
        await image.save();
    } catch (err) {
        return res.render(`admin/images/new`, {
            data: data,
            error: err,
        });
    }*/

    res.redirect(`/admin/images`);
});

/**
 * Edit form
 */
/*router.get("/:id", async (req, res) => {
    let podcast: PodcastModel;
    try {
        podcast = await Podcast.findById(req.params.id).populate("pic") as PodcastModel;
    } catch (err) {
        return res.redirect("/")
    }
    if (!podcast) return res.redirect("/");

    res.locals.bc.push([podcast.name]);

    res.render(`${url}/edit`, { item: podcast, data: podcast });
});*/

/**
 * Edit logic
 */
/*router.post("/:id", validator.edit, async (req, res, next) => {

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

});*/

/**
 * Delete
 */
/*router.get("/:id/delete", async (req, res, next) => {
    let podcast = await Podcast.findById(req.params.id) as PodcastModel;
    podcast.remove();

    res.redirect(`/${url}`);
});*/

// --------------------------------------------------
// PRIVATE
// --------------------------------------------------

/**
 * Populate the travel from the form
 * @param image 
 * @param data 
 * @param req 
 */
const populate = (image: ImageModel, data: NewData, req: express.Request) => {
    return new Promise(async (resolve, reject) => {
        image.name = data.name;
        image.description = data.description
        image.url = PIC_PATH;

        if (req.files.pic) {
            let pic = req.files.pic as UploadedFile;

            let pic_id = (await mv_pic(`${PIC_PATH}`, pic)).id;

            resolve();
        } else {
            resolve();
        }
    })
}

export default router;