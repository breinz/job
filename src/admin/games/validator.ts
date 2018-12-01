import { NewData, NewErrors, EditData, EditErrors, GameValidator } from ".";
import Game, { GameModel } from "../../games/model";

let validator: GameValidator = {};

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
    let game: GameModel;
    try {
        game = await Game.findOne({ name: data.name }) as GameModel;
        if (game) {
            errors.name = "Name has to be unique";
        }
    } catch (err) {
        return next(err);
    }

    if (Object.keys(errors).length > 0) {
        return res.render("admin/games/new", {
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

    // Name required
    if (data.name.length === 0) {
        errors.name = "Name is required";
    }

    // Name unique
    let game: GameModel;
    try {
        game = await Game.findOne({ name: data.name }) as GameModel;
        if (game && game.id !== req.params.id) {
            errors.name = "Name has to be unique";
        }
    } catch (err) {
        return next(err);
    }

    // If has errors, re-render the form with errors
    if (Object.keys(errors).length > 0) {

        let game: GameModel;
        try {
            game = await Game.findById(req.params.id) as GameModel;
        } catch (err) {
            res.redirect("/");
        }
        return res.render("admin/games/edit", {
            game: game,
            data: data,
            errors: errors
        });
    }

    next();
}

export default validator;