import { NewData, NewErrors, EditData, EditErrors, WorkValidator } from ".";
import Podcast, { PodcastModel } from "../../podcasts/model";
import Work, { WorkModel } from "../../work/model";

let validator: WorkValidator = {};

/**
 * New validator
 */
validator.new = async (req, res, next) => {
    let errors: NewErrors = {};
    const data: NewData = req.body;

    // Title required
    if (data.title.length === 0) {
        errors.title = " is required";
    }

    if (Object.keys(errors).length > 0) {
        return res.render("admin/work/new", {
            data: data,
            errors: errors,
        });
    }

    next();
}

/**
 * Edit validator
 */
validator.edit = async (req, res, next) => {
    let errors: EditErrors = {};
    const data: EditData = req.body;

    // Name required
    if (data.title.length === 0) {
        errors.title = " is required";
    }

    // If has errors, re-render the form with errors
    if (Object.keys(errors).length > 0) {

        let work: WorkModel;
        try {
            work = await Work.findById(req.params.id) as WorkModel;
        } catch (err) {
            res.redirect("/");
        }
        return res.render("admin/work/edit", {
            item: work,
            data: data,
            errors: errors
        });
    }

    next();
}

export default validator;