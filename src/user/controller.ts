import express = require("express");
import User, { UserModel } from "./model";
import validator from "./validator";
import { Signup, Login } from ".";

let router = express.Router();

/**
 * GET /users/signup
 * Signup form
 */
router.get("/signup", validator.notLoggedIn, (req, res) => {
    res.render("user/signup");
});

/**
 * POST /users/signup
 * Signup
 */
router.post("/signup", validator.signup, async (req, res) => {
    let user = new User() as UserModel;

    const data: Signup.Data = req.body;

    user.login = data.login;
    user.email = data.email;
    user.password = data.password;

    await user.save();


    res.redirect("/");
});

/**
 * Login form
 */
router.get("/login", (req, res) => {
    res.render("user/login");
});

/**
 * Login logic
 */
router.post("/login", async (req, res, next) => {
    const data: Login.Data = req.body;

    const user: UserModel = await User.findOne({ email: data.email }) as UserModel;

    if (!user) {
        return res.render("user/login", { error: true });
    }

    user.validPassword(data.password, (err, match, session) => {
        if (err) return next(err);
        if (match !== true) {
            return res.render("user/login", { error: true });
        }

        res.cookie("uid", user.id, { maxAge: 1000 * 60 * 60, httpOnly: true });
        res.cookie("usession", session, { maxAge: 1000 * 60 * 60, httpOnly: true });

        return res.redirect("/");
    });
});

/**
 * Logout
 */
router.get("/logout", (req, res) => {
    res.clearCookie("uid");
    res.clearCookie("usession");
    res.redirect("/");
});

/**
 * Delete a user
 * TODO: Admin shield
 */
router.get("/:id/delete", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);

    res.redirect("/")
});

router.get("/:id/admin", async (req, res) => {
    let user = await User.findById(req.params.id) as UserModel;
    user.admin = true;
    await user.save();
    res.redirect("/");
})

export default router;