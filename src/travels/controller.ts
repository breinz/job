import express = require("express");
import Travel, { TravelModel } from "./model";
import { populateChildren } from "../admin/travels/controller";
import { t, lang } from "../langController";
import { runInNewContext } from "vm";
//import Game, { GameModel } from "./model";

const router = express.Router();

/**
 * Menu item
 * Breadcrumb
 */
router.use((req, res, next) => {
    res.locals.menu = "travel";
    res.locals.bc = [[t("travels.page-title"), "/travels"]];
    next();
})

/**
 * Home
 */
router.get("/", async (req, res) => {
    res.locals.bc = [];

    let travels = await Travel.find({ parent: null }).sort({ name: 1 }).populate("pic") as [TravelModel];

    res.render("travels/index", { travels: travels });
});

/**
 * All travels
 */
router.get("/all", async (req, res) => {
    res.locals.bc.push(["All"]);

    const items = await Travel.find({ parent: null }).sort({ name: 1 }).populate('pic') as [TravelModel];


    for (let i = 0; i < items.length; i++) {
        await populateChildren(items[i]);
    }

    res.render("travels/all", { items: items });
});

/**
 * all
 */
router.get("*", async (req, res, next) => {
    let route = req.path.substr(1).split('/');

    // The current travel
    let travel: TravelModel;
    try {
        travel = await Travel.findOne({ url: route[route.length - 1] }).populate("pic").populate('pics') as TravelModel;
    } catch (err) {
        return res.redirect("/travels");
    }

    if (travel === null) {
        return res.redirect("/travels");
    }

    if (!req.current_user || !req.current_user.admin) {
        travel.stat.viewed++;
        try {
            await travel.save();
        } catch (err) {
            return next(err);
        }
    }

    // Find parents
    let tree = await findParents(travel);

    // Populate breadcrumb
    if (tree) {
        let url = "/travels";
        for (let i = 0; i < tree.length; i++) {
            url += `/${tree[i].url}`;
            res.locals.bc.push([t(tree[i], "name"), url]);
        }
    }
    res.locals.bc.push([t(travel, "name")]);

    let sort: { [index: string]: number } = {};
    sort[`name_${lang}`] = 1;

    // Find the children
    let children = await Travel.find({ parent: travel.id }).sort(sort).populate("pic") as [TravelModel];

    res.render("travels/travel", {
        travel: travel,
        travels: children,
        path: "/travels" + req.path,
        seo: travel.seo
    });
});

/**
 * Recursively find parents
 * @param travel The travel
 * @param tree The parent tree
 */
const findParents = (travel: TravelModel, tree: [TravelModel] = null): Promise<[TravelModel]> => {
    return new Promise(async (resolve, reject) => {
        if (travel.parent) {
            let parent = await Travel.findById(travel.parent) as TravelModel;
            if (tree) {
                tree.unshift(parent);
            } else {
                tree = [parent]
            }
            resolve(await findParents(parent, tree));
        } else {
            if (tree) return resolve(tree)
            resolve()
        }
    });
}

export default router;