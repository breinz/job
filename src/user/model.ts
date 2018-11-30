import { Document, Schema, model, Model } from "mongoose";
import * as bcrypt from "bcrypt-nodejs"

// --------------------------------------------------
// Type
// --------------------------------------------------

export type UserModel = Document & {
    login: string,
    email: string,
    password: string,
    admin: boolean,

    validPassword: (
        candidate: string,
        next: (
            err: Error,
            match?: boolean,
            session?: string
        ) => void
    ) => void,
    validSession: (
        candidate: string,
        next: (
            err: Error,
            match: boolean
        ) => void
    ) => void
};

// --------------------------------------------------
// Schema
// --------------------------------------------------

const userSchema = new Schema({
    login: { type: String },
    email: { type: String, unique: true },
    password: String,
    admin: { type: Boolean, default: false }
});

/**
 * Before save
 */
userSchema.pre("save", function save(next) {
    const user = this as UserModel;

    // Crypt the password
    if (!this.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, undefined, (err: Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            //if (!user.isNew) {
            next();
            //}
        });
    });
});

/**
 * Compare passwords
 */
userSchema.methods.validPassword = async function (
    candidatePassword: string,
    next: (
        err: Error,
        isMatch?: boolean,
        session?: string
    ) => void) {

    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return next(err);
        if (!isMatch) {
            return next(err, isMatch);
        }

        const user = this as UserModel;

        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);

            bcrypt.hash(user.email, salt, undefined, (err: Error, hash) => {
                if (err) { return next(err); }
                next(err, isMatch, hash);
            });
        });

    });
}

/**
 * Compare sessions
 */
userSchema.methods.validSession = function (
    candidate: string,
    next: (
        err: Error,
        isMatch?: boolean
    ) => void) {

    bcrypt.compare(this.email, candidate, (err, isMatch) => {
        next(err, isMatch);
    })


}

export const User = model("User", userSchema) as Model<Document> & UserModel;
export default User;