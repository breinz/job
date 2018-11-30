"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const userSchema = new mongoose_1.Schema({
    login: { type: String },
    email: { type: String, unique: true },
    password: String,
    admin: { type: Boolean, default: false }
});
userSchema.pre("save", function save(next) {
    const user = this;
    if (!this.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, undefined, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});
userSchema.methods.validPassword = function (candidatePassword, next) {
    return __awaiter(this, void 0, void 0, function* () {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if (err)
                return next(err);
            if (!isMatch) {
                return next(err, isMatch);
            }
            const user = this;
            bcrypt.genSalt(10, (err, salt) => {
                if (err)
                    return next(err);
                bcrypt.hash(user.email, salt, undefined, (err, hash) => {
                    if (err) {
                        return next(err);
                    }
                    next(err, isMatch, hash);
                });
            });
        });
    });
};
userSchema.methods.validSession = function (candidate, next) {
    bcrypt.compare(this.email, candidate, (err, isMatch) => {
        next(err, isMatch);
    });
};
exports.User = mongoose_1.model("User", userSchema);
exports.default = exports.User;
//# sourceMappingURL=model.js.map