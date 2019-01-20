import express = require("express");
import Bazaar, { BazaarModel } from "./model";

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

    let items = await Bazaar.find({ parent: null }).collation({ locale: "en" }).sort({ title: 1 }) as [BazaarModel];

    res.render("bazaar/index", { items: items });
});

/**
 * all
 */
router.get("*", async (req, res) => {
    let route = req.path.substr(1).split('/');

    // The current bazaar item
    let item: BazaarModel;
    try {
        item = await Bazaar.findOne({ url: route[route.length - 1] }) as BazaarModel;
    } catch (err) {
        return res.redirect("/bazaar");
    }

    if (item === null) {
        return res.redirect("/bazaar");
    }

    // Find parents
    let tree = await findParents(item);

    // Populate breadcrumb
    if (tree) {
        let url = "/bazaar";
        for (let i = 0; i < tree.length; i++) {
            url += `/${tree[i].url}`;
            res.locals.bc.push([tree[i].title, url]);
        }
    }
    res.locals.bc.push([item.title]);

    // Find the children
    let children = await Bazaar.find({ parent: item.id }).collation({ locale: "en" }).sort({ name: 1 }) as [BazaarModel];

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