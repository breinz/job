import express = require("express");
import { Citation, CitationModel } from "../../citations/model";
import validator from "./validator"
import { NewData, EditData } from ".";

let router = express.Router();

/**
 * Menu item
 * Breadcrumb
 * Image folder
 */
router.use(async (req, res, next) => {
    res.locals.menu = "citation";
    res.locals.bc.push(["Citations", "/admin/citations"]);

    next();
});

/**
 * Index
 */
router.get("/", async (req, res) => {
    res.locals.bc.pop();
    res.locals.bc.push(["Citations"]);

    const items = await Citation.find() as [CitationModel];
    //const graph = await Travel.find({ parent: null }).sort({ name: 1 }).populate('pic') as [TravelModel];

    res.render("admin/citations/index", { items: items });
});

/**
 * New form
 */
router.get("/new", async (req, res) => {
    res.locals.bc.push(["New"]);

    res.render("admin/citations/new")
});

/**
 * New logic
 */
router.post("/new", validator.new, async (req, res) => {
    const data: NewData = req.body;

    let citation = new Citation() as CitationModel;

    citation.content = data.content;
    citation.source = data.source;

    try {
        await citation.save();
    } catch (err) {
        return res.render('admin/citations/new', {
            data: data,
            error: err,
        });
    }

    res.redirect("/admin/citations");
});

/**
 * Edit form
 */
router.get("/:id", async (req, res) => {
    let citation: CitationModel;
    try {
        citation = await Citation.findById(req.params.id) as CitationModel;
    } catch (err) {
        return res.redirect("/")
    }
    if (!citation) return res.redirect("/");

    res.locals.bc.push(["Edit"]);

    res.render("admin/citations/edit", { item: citation, data: citation });
});

/**
 * Edit logic
 */
router.post("/:id", validator.edit, async (req, res, next) => {

    let citation: CitationModel;
    try {
        citation = await Citation.findById(req.params.id) as CitationModel;
    } catch (err) {
        return next(err)
    }
    if (!citation) return res.redirect("/");

    const data: EditData = req.body;

    citation.content = data.content;
    citation.source = data.source;

    try {
        await citation.save();
    } catch (err) {
        return next(err)
    }

    res.redirect("/admin/citations");

});

/**
 * Delete
 */
router.get("/:id/delete", async (req, res) => {
    await Citation.findByIdAndDelete(req.params.id);
    res.redirect("/admin/citations");
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
/*const populateTravel = (travel: TravelModel, data: NewData | EditData, req: express.Request) => {
    return new Promise(async (resolve, reject) => {
        travel.name = data.name;
        travel.title = data.title;
        travel.url = changeCase.paramCase(data.name);
        travel.parent = data.parent || null;
        travel.description = data.description

        if (req.files.pic) {
            console.log("save pic");
            let pic = req.files.pic as UploadedFile;

            //await mkdir(`${PIC_PATH}/${travel.id}`);
            let pic_id = await mv_pic(`${PIC_PATH}`, pic);

            travel.pic = pic_id;

            resolve();
        } else {
            resolve();
        }
    })
}*/

export default router;