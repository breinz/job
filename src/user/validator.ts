import { Signup, Validator } from "."
import User, { UserModel } from "./model";

let validator: Validator = {};

/**
 * Logged in shield
 */
validator.loggedIn = (req, res, next) => {
    if (!req.current_user) {
        return res.redirect("/users/login")
    }
    next();
}

/**
 * Not logged in shield
 */
validator.notLoggedIn = (req, res, next) => {
    if (req.current_user) {
        return res.redirect("/")
    }
    next();
}

/**
 * Signup form validator
 */
validator.signup = async (req, res, next) => {
    // Form errors
    let errors: Signup.Errors = {};

    // Form data
    const data: Signup.Data = req.body;

    // --------------------------------------------------
    // Login
    // --------------------------------------------------

    // Login required
    if (data.login.length === 0) {
        errors.login = "Login required";
    }

    // Login min length
    if (!errors.login && data.login.length < 3) {
        errors.login = "Login too short";
    }

    // --------------------------------------------------
    // Email
    // --------------------------------------------------

    // Email required
    if (data.email.length === 0) {
        errors.email = "Email required";
    }

    // Valid email
    if (!errors.email && !data.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        errors.email = "Email is not valid";
    }

    // Email not already used
    if (!errors.email) {
        let user: UserModel;
        try {
            user = await User.findOne({ email: data.email }) as UserModel;
            if (user) {
                errors.email = "Email already used for an account";
            }
        } catch (err) {
            return next(err);
        }
    }

    // --------------------------------------------------
    // Password
    // --------------------------------------------------

    // Password required
    if (data.password.length === 0) {
        errors.password = "Password required";
    }

    // Passwords must match
    if (data.password !== data.password2) {
        errors.password2 = "Password don't match";
    }

    // --------------------------------------------------

    // Check if there is an error
    if (Object.keys(errors).length > 0) {
        res.render("user/signup", { errors: errors, data: data });
    } else {
        next();
    }
}

export default validator;
