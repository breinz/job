import { NextFunction, Request, Response } from "express";
import { NewData, NewErrors } from ".";


export let validator = {
    new: async (req: Request, res: Response, next: NextFunction) => {
        let errors: NewErrors = {};
        const data: NewData = req.body;

        // Name required
        if (data.name.length === 0) {
            errors.name = "Name is required";
        }

        if (Object.keys(errors).length > 0) {
            return res.render("admin/games/new", {
                data: data,
                errors: errors
            });
        }

        next();

    }
}