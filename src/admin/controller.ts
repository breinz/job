import express = require("express");
import User, { UserModel } from "../user/model";
import gamesController from "./games/controller"
import usersController from "./users/controller"


let router = express.Router();


/**
 * Admin shield
 */
router.use((req, res, next) => {
    if (!req.current_user) {
        return res.redirect('/');
    }
    if (!req.current_user.admin) {
        return res.redirect('/');
    }
    next();
});

router.use("/games", gamesController);
router.use("/users", usersController);

/**
 * Index
 */
router.get("/", (req, res) => {
    res.render("admin/index");
});

export default router;