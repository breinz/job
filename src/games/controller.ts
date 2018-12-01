import express = require("express");
import Game, { GameModel } from "./model";

const router = express.Router();

/**
 * Play
 */
router.get("/:id", async (req, res) => {
    let game: GameModel;
    try {
        game = await Game.findById(req.params.id) as GameModel;
    } catch (err) {
        return res.redirect('/');
    }

    if (!game) return res.redirect('/');

    res.render("games/play", { game: game });
});

export default router;