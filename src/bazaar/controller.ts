import express = require("express");
import Bazaar, { BazaarModel } from "./model";
import Podcast, { PodcastModel } from "../podcasts/model";
import { t, lang } from "../langController";
import { processText } from "../utils";
import { ImageModel } from "../images/model";

const router = express.Router();

/**
 * Menu item
 * Breadcrumb
 */
router.use((req, res, next) => {
    res.locals.menu = "bazaar";
    res.locals.bc = [["Bazaar", "/bazaar"]];
    next();
})

/**
 * Home
 */
router.get("/", async (req, res) => {
    res.locals.bc = [["Bazaar"]];
    res.locals.bc = [];

    let items = await Bazaar.find({ parent: null }).sort({ title: 1 }) as [BazaarModel];

    res.render("bazaar/index", { items: items });
});

router.get("/podcasts", async (req, res) => {

    let item = await Bazaar.findOne({ url: "podcasts" }) as BazaarModel;

    res.locals.bc.push([t(item, "title")]);

    let sort: { [index: string]: number } = {};
    sort["name_" + lang] = 1;

    let list = await Podcast.find().sort(sort).populate("pic") as [PodcastModel];

    res.render("bazaar/podcasts/index", { item: item, list: list });
});

/**
 * all
 */
router.get("*", async (req, res) => {
    let route = req.path.substr(1).split('/');

    // The current bazaar item
    let item: BazaarModel;
    try {
        item = await Bazaar.findOne({ url: route[route.length - 1] }).populate("pics") as BazaarModel;
    } catch (err) {
        return res.redirect("/bazaar");
    }

    if (item === null) {
        return res.redirect("/bazaar");
    }

    item[`description_${lang}`] = processText(t(item, "description"), "/img/bazaar/", <ImageModel[]>item.pics);

    // Find parents
    let tree = await findParents(item);

    // Populate breadcrumb
    if (tree) {
        let url = "/bazaar";
        for (let i = 0; i < tree.length; i++) {
            url += `/${tree[i].url}`;
            res.locals.bc.push([t(tree[i], "link"), url]);
        }
    }
    res.locals.bc.push([t(item, "link")]);

    // Find the children
    let children = await Bazaar.find({ parent: item.id }).sort({ name: 1 }) as [BazaarModel];

    res.render("bazaar/item", { item: item, children: children, path: "/bazaar" + req.path });
});

/**
 * Recursively find parents
 * @param item The bazaar item
 * @param tree The parent tree
 */
const findParents = (item: BazaarModel, tree: [BazaarModel] = null): Promise<[BazaarModel]> => {
    return new Promise(async (resolve, reject) => {
        if (item.parent) {
            let parent = await Bazaar.findById(item.parent) as BazaarModel;
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