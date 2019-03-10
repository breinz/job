import express = require("express");
import User, { UserModel } from "../user/model";
import gamesController from "./games/controller"
import usersController from "./users/controller"
import travelsController from "./travels/controller"
import bazaarController from "./bazaar/controller"
import citationController from "./citations/controller"
import imagesController from "./images/controller"
import workController from "./work/controller";
import statsController from "./stats/controller";
import Work from "../work/model";
import Travel from "../travels/model";
import Bazaar from "../bazaar/model";
import Citation from "../citations/model";
import Podcast from "../podcasts/model";
import Stat from "../stats/model";


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
router.use("/work", workController);
router.use("/stats", statsController);

/**
 * Index
 */
router.get("/", async (req, res) => {
    let users_count = await User.estimatedDocumentCount();
    let work_count = await Work.estimatedDocumentCount();
    let travel_count = await Travel.estimatedDocumentCount();
    let bazaar_count = await Bazaar.estimatedDocumentCount();
    let citation_count = await Citation.estimatedDocumentCount();
    let podcast_count = await Podcast.estimatedDocumentCount();

    let stats = await Stat.find().sort({ date: 1 });

    res.render("admin/index", {
        users_count: users_count,
        work_count: work_count,
        travel_count: travel_count,
        bazaar_count: bazaar_count,
        citation_count: citation_count,
        podcast_count: podcast_count,
        stats: stats
    });
});

export default router;