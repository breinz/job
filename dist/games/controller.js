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
const model_1 = require("./model");
const router = express.Router();
router.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let game;
    try {
        game = (yield model_1.default.findById(req.params.id));
    }
    catch (err) {
        return res.redirect('/');
    }
    if (!game)
        return res.redirect('/');
    res.render("games/play", { game: game });
}));
exports.default = router;
//# sourceMappingURL=controller.js.map