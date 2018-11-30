import express = require("express");
import { Game, GameModel } from "../../games/model";
import { NewData } from ".";
import { validator } from "./validator";

let router = express.Router();

/**
 * Index
 */
router.get("/", async (req, res) => {
    const games = await Game.find().setOptions({ sort: { name: 1 } }) as GameModel[];
    res.render("admin/games/index", { games: games });
});

/**
 * New form
 */
router.get("/new", (req, res) => {
    res.render("admin/games/new")
});

/**
 * New logic
 */
router.post("/new", validator.new, async (req, res) => {
    const data: NewData = req.body;

    let game = new Game() as GameModel;

    game.name = data.name;

    try {
        await game.save();
    } catch (err) {
        return res.render('admin/games/new', { data: data, error: err });
    }

    res.redirect("/admin/games");
});

/**
 * Delete
 */
router.get("/:id/delete", async (req, res) => {
    await Game.findByIdAndDelete(req.params.id);
    res.redirect("/admin/games");
});

export default router;