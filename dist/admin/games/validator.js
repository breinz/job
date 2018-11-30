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
exports.validator = {
    new: (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let errors = {};
        const data = req.body;
        if (data.name.length === 0) {
            errors.name = "Name is required";
        }
        if (Object.keys(errors).length > 0) {
            return res.render("admin/games/new", {
                data: data,
                errors: errors
            });
        }
        next();
    })
};
//# sourceMappingURL=validator.js.map