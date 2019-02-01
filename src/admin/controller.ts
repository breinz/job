import express = require("express");
import User, { UserModel } from "../user/model";
import gamesController from "./games/controller"
import usersController from "./users/controller"
import travelsController from "./travels/controller"
import bazaarController from "./bazaar/controller"
import citationController from "./citations/controller"
import imagesController from "./images/controller"


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

/**
 * Breadcrumb
 */
router.use((req, res, next) => {
    res.locals.bc = [["Admin", "/admin"]];
    next();
});

router.use("/games", gamesController);
router.use("/users", usersController);
router.use("/travels", travelsController);
router.use("/bazaar", bazaarController);
router.use("/citations", citationController);
router.use("/images", imagesController);

/**
 * Index
 */
router.get("/", (req, res) => {
    res.render("admin/index");
});

export default router;