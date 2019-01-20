import { NewData, NewErrors, EditData, EditErrors, TravelValidator } from ".";
import Travel, { TravelModel } from "../../travels/model";
import { getAvailableParents } from "./controller";

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

    // Name unique
    let travel: TravelModel;
    try {
        travel = await Travel.findOne({ name: data.name }) as TravelModel;
        if (travel) {
            errors.name = "Name has to be unique";
        }
    } catch (err) {
        return next(err);
    }

    if (Object.keys(errors).length > 0) {
        return res.render("admin/travels/new", {
            data: data,
            errors: errors,
            parents: await getAvailableParents()
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

    // Name unique
    let travel: TravelModel;
    try {
        travel = await Travel.findOne({ name: data.name }) as TravelModel;
        if (travel && travel.id !== req.params.id) {
            errors.name = "Name has to be unique";
        }
    } catch (err) {
        return next(err);
    }

    // If has errors, re-render the form with errors
    if (Object.keys(errors).length > 0) {

        let travel: TravelModel;
        try {
            travel = await Travel.findById(req.params.id) as TravelModel;
        } catch (err) {
            res.redirect("/");
        }
        return res.render("admin/travels/edit", {
            travel: travel,
            data: data,
            errors: errors
        });
    }

    next();
}

export default validator;