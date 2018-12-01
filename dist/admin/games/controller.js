"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const model_1 = require("../../games/model");
const validator_1 = require("./validator");
let router = express.Router();
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const games = yield model_1.Game.find().setOptions({ sort: { name: 1 } });
    res.render("admin/games/index", { games: games });
}));
router.get("/new", (req, res) => {
    res.render("admin/games/new");
});
router.post("/new", validator_1.default.new, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = req.body;
    let game = new model_1.Game();
    game.name = data.name;
    try {
        yield game.save();
    }
    catch (err) {
        return res.render('admin/games/new', { data: data, error: err });
    }
    res.redirect("/admin/games");
}));
router.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let game;
    try {
        game = (yield model_1.Game.findById(req.params.id));
    }
    catch (err) {
        return res.redirect("/");
    }
    if (!game)
        return res.redirect("/");
    res.render("admin/games/edit", { game: game, data: game });
}));
router.post("/:id", validator_1.default.edit, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let game;
    try {
        game = (yield model_1.Game.findById(req.params.id));
    }
    catch (err) {
        return res.redirect("/");
    }
    if (!game)
        return res.redirect("/");
    const data = req.body;
    game.name = data.name;
    game.width = data.width;
    game.height = data.height;
    try {
        yield game.save();
    }
    catch (err) {
        return res.redirect("/");
    }
    res.redirect("/admin/games");
}));
router.get("/:id/delete", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield model_1.Game.findByIdAndDelete(req.params.id);
    res.redirect("/admin/games");
}));
exports.default = router;
//# sourceMappingURL=controller.js.map