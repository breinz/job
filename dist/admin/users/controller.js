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
const express = require("express");
const model_1 = require("../../user/model");
let router = express.Router();
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let users = yield model_1.default.find().setOptions({ sort: { login: 1 } });
    res.render("admin/users/index", { users: users });
}));
exports.default = router;
//# sourceMappingURL=controller.js.map