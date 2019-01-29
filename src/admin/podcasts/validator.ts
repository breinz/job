import { NewData, NewErrors, EditData, EditErrors, TravelValidator } from ".";
import Podcast, { PodcastModel } from "../../podcasts/model";

let validator: TravelValidator = {};

/**
 * New validator
 */
validator.new = async (req, res, next) => {
    let errors: NewErrors = {};
    const data: NewData = req.body;

    // Name required
    if (data.name.length === 0) {
        errors.name = "Name is required";
    }

    if (Object.keys(errors).length > 0) {
        return res.render("admin/bazaar/podcasts/new", {
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
    if (data.name.length === 0) {
        errors.name = "Name is required";
    }

    // If has errors, re-render the form with errors
    if (Object.keys(errors).length > 0) {

        let podcast: PodcastModel;
        try {
            podcast = await Podcast.findById(req.params.id) as PodcastModel;
        } catch (err) {
            res.redirect("/");
        }
        return res.render("admin/bazaar/podcasts/edit", {
            item: podcast,
            data: data,
            errors: errors
        });
    }

    next();
}

export default validator;