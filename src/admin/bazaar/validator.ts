import { NewData, NewErrors, EditData, EditErrors, BazaarValidator } from ".";
import Bazaar, { BazaarModel } from "../../bazaar/model";
import { getAvailableParents } from "./controller";

let validator: BazaarValidator = {};

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
        return res.render("admin/bazaar/new", {
            data: data,
            errors: errors,
            //parents: await getAvailableParents()
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

        let item: BazaarModel;
        try {
            item = await Bazaar.findById(req.params.id) as BazaarModel;
        } catch (err) {
            res.redirect("/");
        }
        return res.render("admin/bazaar/edit", {
            item: item,
            data: data,
            errors: errors,
            parents: await getAvailableParents()
        });
    }

    next();
}

export default validator;