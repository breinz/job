import * as path from "path"
import express = require("express");
import { Travel, TravelModel } from "../../travels/model";
import { NewData, EditData } from ".";
import validator from "./validator";
import { UploadedFile } from "express-fileupload";
import * as fs from 'fs'
import { mkdir, mv_pic, rm_pic } from "../../utils";
import * as changeCase from "change-case"
import picsController from "./picsController";
import Image, { ImageModel } from "../../images/model";
import { runInNewContext } from "vm";

const PIC_PATH = "img/travels"

/**
 * Get a list of available parents
 */
export const getAvailableParents = async () => {
    let travels = await Travel.find({ parent: null }) as [TravelModel];

    for (let i = 0; i < travels.length; i++) {
        await populateChildren(travels[i]);
    }
    return travels;
}

/**
 * Populate children recursively
 * @param travel The travel to populate children
 */
const populateChildren = async (travel: TravelModel) => {
    const children = await Travel.find({ parent: travel.id }).sort({ name: 1 }).populate('pic') as [TravelModel];

    travel.children = children;

    for (let i = 0; i < children.length; i++) {
        await populateChildren(children[i]);
    }
}

let router = express.Router();

/**
 * Menu item
 * Breadcrumb
 * Image folder
 */
router.use(async (req, res, next) => {
    res.locals.menu = "travel";
    res.locals.bc.push(["Travels", "/admin/travels"]);

    await mkdir(PIC_PATH);

    next();

})

router.use("/:travel_id/pictures", picsController);

// --------------------------------------------------
// ROUTES
// --------------------------------------------------

/**
 * Index
 */
router.get("/", async (req, res) => {
    res.locals.bc.pop();
    res.locals.bc.push(["Travels"]);

    const graph = await Travel.find({ parent: null }).sort({ name: 1 }).populate('pic') as [TravelModel];


    for (let i = 0; i < graph.length; i++) {
        await populateChildren(graph[i]);
    }

    res.render("admin/travels/index", { travels: graph });
});

/**
 * New form
 */
router.get("/new", async (req, res) => {
    res.locals.bc.push(["New"]);

    res.render("admin/travels/new", { parents: await getAvailableParents() })
});

/**
 * New logic
 */
router.post("/new", validator.new, async (req, res) => {
    const data: NewData = req.body;

    let travel = new Travel() as TravelModel;

    await populateTravel(travel, data, req);

    try {
        await travel.save();
    } catch (err) {
        return res.render('admin/travels/new', {
            data: data,
            error: err,
            parents: await getAvailableParents()
        });
    }

    res.redirect("/admin/travels");
});

/**
 * Edit form
 */
router.get("/:id", async (req, res) => {
    let travel: TravelModel;
    try {
        travel = await Travel.findById(req.params.id).populate("pic") as TravelModel;
    } catch (err) {
        return res.redirect("/")
    }
    if (!travel) return res.redirect("/");

    res.locals.bc.push([travel.name]);

    res.render("admin/travels/edit", { travel: travel, data: travel, parents: await getAvailableParents() });
});

/**
 * Edit logic
 */
router.post("/:id", validator.edit, async (req, res, next) => {

    let travel: TravelModel;
    try {
        travel = await Travel.findById(req.params.id) as TravelModel;
    } catch (err) {
        return next(err)
    }
    if (!travel) return res.redirect("/");

    const data: EditData = req.body;

    await populateTravel(travel, data, req);

    try {
        await travel.save();
    } catch (err) {
        console.log("2");
        return next(err)
    }

    res.redirect("/admin/travels");

});

/**
 * Delete
 */
router.get("/:id/delete", async (req, res, next) => {
    let travel = await Travel.findById(req.params.id) as TravelModel;
    travel.remove();

    res.redirect("/admin/travels");
});

// --------------------------------------------------
// PRIVATE
// --------------------------------------------------

/**
 * Populate the travel from the form
 * @param travel 
 * @param data 
 * @param req 
 */
const populateTravel = (travel: TravelModel, data: NewData | EditData, req: express.Request) => {
    return new Promise(async (resolve, reject) => {
        travel.name = data.name;
        travel.title = data.title;
        travel.url = changeCase.paramCase(data.name);
        travel.parent = data.parent || null;
        travel.description = data.description

        if (req.files.pic) {
            let pic = req.files.pic as UploadedFile;

            //await mkdir(`${PIC_PATH}/${travel.id}`);
            let pic_id = await mv_pic(`${PIC_PATH}`, pic);

            travel.pic = pic_id;

            resolve();
        } else {
            resolve();
        }
    })
}

export default router;