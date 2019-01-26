import express = require("express");
import Travel, { TravelModel } from "../../travels/model";
import { mv_pic, rm_pic } from "../../utils";
import { UploadedFile } from "express-fileupload";
import { NewPicData } from ".";
import Image, { ImageModel } from "../../images/model";
import { runInNewContext } from "vm";

let router = express.Router({ mergeParams: true });

/**
 * The travel concerned
 */
let travel: TravelModel;

/**
 * Find the travel concerned
 */
router.use(async (req, res, next) => {
    //let travel: TravelModel;
    try {
        travel = await Travel.findById(req.params.travel_id).populate("pics") as TravelModel;
    } catch (err) {
        return next(err)
    }
    if (!travel) return next(`Travel not found ${req.params.travel_id}`);
    next();
});

/**
 * Breadcrumb
 */
router.use((req, res, next) => {
    res.locals.bc.push(
        [travel.name, `/admin/travels/${travel.id}`],
        ["Pictures", `/admin/travels/${travel.id}/pictures`]
    );
    next();
})

// --------------------------------------------------
// Routes
// --------------------------------------------------

/**
 * Home
 */
router.get("/", async (req, res, next) => {
    res.locals.bc.pop();
    res.locals.bc.push(["Pictures"]);

    res.render("admin/travels/pics/index", { travel: travel });
});

/**
 * New
 */
router.get("/new", async (req, res, next) => {
    res.locals.bc.push(["New"]);

    res.render("admin/travels/pics/new", { travel: travel });
});

/**
 * New logic
 */
router.post("/new", async (req, res, next) => {
    let data: NewPicData = req.body;

    let pic_id = await mv_pic("img/travels", <UploadedFile>req.files.pic, data.name, data.description);

    travel.pics.push(pic_id);

    try {
        travel.save();
    } catch (error) {
        next(error);
    }

    res.redirect(`/admin/travels/${req.params.travel_id}/pictures`);
});

/**
 * Delete
 */
router.get("/:id/delete", async (req, res, next) => {

    // Remove the link with the Travel record
    try {
        travel.pics.remove(req.params.id);
        travel.save();
    } catch (err) {
        next(err);
    }

    // Find the Image record
    let pic: ImageModel;
    try {
        pic = await Image.findById(req.params.id) as ImageModel;
    } catch (err) {
        next(err);
    }

    // Remove the actual picture (and versions) from hard drive
    try {
        await rm_pic(pic);
    } catch (err) {
        next(err);
    }

    // Remove the Image record
    try {
        await Image.findByIdAndDelete(req.params.id);
    } catch (err) {
        next(err);
    }

    res.redirect(`/admin/travels/${req.params.travel_id}/pictures`);
});

export default router;