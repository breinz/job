import express = require("express");
import User, { UserModel } from "../../user/model";

let router = express.Router();

/**
 * Users
 */
router.get("/", async (req, res) => {
    let users = await User.find().setOptions({ sort: { login: 1 } }) as UserModel[];

    res.render("admin/users/index", { users: users });
});

export default router;