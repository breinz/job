import { NewData, NewErrors, EditData, EditErrors, CitationValidator } from ".";
import Travel, { TravelModel } from "../../travels/model";

let validator: CitationValidator = {};

/**
 * New validator
 */
validator.new = async (req, res, next) => {
    let errors: NewErrors = {};
    const data: NewData = req.body;

    // Content required
    if (data.content.length === 0) {
        errors.content = " is required";
    }

    if (Object.keys(errors).length > 0) {
        return res.render("admin/citations/new", {
            data: data,
            errors: errors
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

    // Content required
    if (data.content.length === 0) {
        errors.content = " is required";
    }

    // If has errors, re-render the form with errors
    if (Object.keys(errors).length > 0) {

        /*let travel: TravelModel;
        try {
            travel = await Travel.findById(req.params.id) as TravelModel;
        } catch (err) {
            res.redirect("/");
        }*/
        return res.render("admin/citations/edit", {
            /*travel: travel,*/
            data: data,
            errors: errors
        });
    }

    next();
}

export default validator;