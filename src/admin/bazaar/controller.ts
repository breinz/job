import express = require("express");
import { NewData, EditData } from ".";
import validator from "./validator";
import { sort, mv_pic } from "../../utils";
import * as changeCase from "change-case"
import Bazaar, { BazaarModel } from "../../bazaar/model";
import podcastController from "../podcasts/controller"
import { lang, t } from "../../langController";
import { UploadedFile } from "express-fileupload";

const PIC_PATH = "img/bazaar"

/**
 * Get a list of available parents
 */
export const getAvailableParents = async () => {
    let items = await Bazaar.find({ parent: null }) as [BazaarModel];

    for (let i = 0; i < items.length; i++) {
        await populateChildren(items[i]);
    }
    return items;
}

/**
 * Populate children recursively
 * @param item The item to populate children
 */
const populateChildren = async (item: BazaarModel) => {
    const children = await Bazaar.find({ parent: item.id }).sort({ title: 1 }) as [BazaarModel];

    item.children = children;

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
    res.locals.menu = "bazaar";
    res.locals.bc.push(["Bazaar", "/admin/bazaar"]);

    //await mkdir(PIC_PATH);

    next();

});

router.use("/podcasts", podcastController);

// --------------------------------------------------
// INDEX
// --------------------------------------------------

/**
 * Index
 */
router.get("/", async (req, res) => {
    res.locals.bc.pop();
    res.locals.bc.push(["Bazaar"]);

    const items = await Bazaar.find({ parent: null }).sort(sort("title")) as [BazaarModel];

    for (let i = 0; i < items.length; i++) {
        await populateChildren(items[i]);
    }

    res.render("admin/bazaar/index", { items: items });
});

/**
 * Create an item
 */
router.post("/", async (req, res) => {
    const data: NewData = req.body;

    let bazaar = new Bazaar() as BazaarModel;

    bazaar[`title_${lang}`] = data.title;

    try {
        bazaar.save();
    } catch (error) {
        return res.sendStatus(500);
    }

    res.redirect(`/admin/bazaar/${bazaar.id}`);
})

// --------------------------------------------------
// NEW
// --------------------------------------------------

/**
 * New form
 */
router.get("/new", async (req, res) => {
    res.locals.bc.push(["New"]);

    console.log(await getAvailableParents());

    res.render("admin/bazaar/new", { parents: await getAvailableParents() })
});

/**
 * New logic
 */
router.post("/new", validator.new, async (req, res) => {
    const data: NewData = req.body;

    let bazaar = new Bazaar() as BazaarModel;

    await populateModel(bazaar, data, req);

    try {
        await bazaar.save();
    } catch (err) {
        return res.render('admin/bazaar/new', {
            data: data,
            error: err,
            //parents: await getAvailableParents()
        });
    }

    res.redirect("/admin/bazaar");
});

// --------------------------------------------------
// EDIT
// --------------------------------------------------

/**
 * Edit form
 */
router.get("/:id", async (req, res) => {
    let item: BazaarModel;
    try {
        item = await Bazaar.findById(req.params.id).populate("pics") as BazaarModel;
    } catch (err) {
        return res.redirect("/")
    }
    if (!item) return res.redirect("/");

    res.locals.bc.push([t(item, "title")]);

    res.render("admin/bazaar/edit", { item: item, data: item, parents: await getAvailableParents() });
});

/**
 * Ajax
 * Add on inline image to use in description
 */
router.post("/:id/add_inline_pic", async (req, res, next) => {
    // Find the Bazaar
    let bazaar: BazaarModel;
    try {
        bazaar = await Bazaar.findById(req.params.id) as BazaarModel;
    } catch (err) {
        return res.send("ERROR!")
    }
    if (!bazaar) return res.send("ERROR!!");


    //console.log(req);
    let file = req.files.file as UploadedFile;
    console.log(file.name);

    let pic = await mv_pic(PIC_PATH, file);

    bazaar.pics.push(pic.id);

    try {
        bazaar.save();
    } catch (err) {
        return res.send("ERROR!!!");
    }

    res.send(`/${PIC_PATH}/${pic.fileName}`);
});

/**
 * Edit logic
 */
router.post("/:id", validator.edit, async (req, res, next) => {

    let item: BazaarModel;
    try {
        item = await Bazaar.findById(req.params.id) as BazaarModel;
    } catch (err) {
        return next(err)
    }
    if (!item) return res.redirect("/");

    const data: EditData = req.body;

    await populateModel(item, data, req);

    try {
        await item.save();
    } catch (err) {
        console.log("2");
        return next(err)
    }

    res.redirect("/admin/bazaar");

});

// --------------------------------------------------
// DELETE
// --------------------------------------------------

/**
 * Delete
 * TODO: Handle children
 */
router.get("/:id/delete", async (req, res) => {
    let item = await Bazaar.findById(req.params.id);
    await item.remove();

    res.redirect("/admin/bazaar");
});

// --------------------------------------------------
// PRIVATE
// --------------------------------------------------

/**
 * Populate the bazaar item from the form
 * @param bazaar 
 * @param data 
 * @param req 
 */
const populateModel = (bazaar: BazaarModel, data: NewData | EditData, req: express.Request) => {
    return new Promise(async (resolve, reject) => {
        bazaar[`title_${lang}`] = data.title;
        // TODO: url unique
        if (bazaar.url) {
            bazaar.url = data.url;
        } else {
            bazaar.url = changeCase.paramCase(data.title);
        }
        bazaar[`link_${lang}`] = data.link;
        bazaar.parent = data.parent || null;
        bazaar[`description_${lang}`] = data.description

        resolve();
    })
}

export default router;