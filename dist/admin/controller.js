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
const model_1 = require("../user/model");
const controller_1 = require("./games/controller");
const controller_2 = require("./users/controller");
const controller_3 = require("./travels/controller");
const controller_4 = require("./bazaar/controller");
const controller_5 = require("./citations/controller");
const controller_6 = require("./images/controller");
const controller_7 = require("./work/controller");
const model_2 = require("../work/model");
const model_3 = require("../travels/model");
const model_4 = require("../bazaar/model");
const model_5 = require("../citations/model");
const model_6 = require("../podcasts/model");
let router = express.Router();
router.use((req, res, next) => {
    if (!req.current_user) {
        return res.redirect('/');
    }
    if (!req.current_user.admin) {
        return res.redirect('/');
    }
    next();
});
router.use((req, res, next) => {
    res.locals.bc = [["Admin", "/admin"]];
    next();
});
router.use("/games", controller_1.default);
router.use("/users", controller_2.default);
router.use("/travels", controller_3.default);
router.use("/bazaar", controller_4.default);
router.use("/citations", controller_5.default);
router.use("/images", controller_6.default);
router.use("/work", controller_7.default);
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let users_count = yield model_1.default.estimatedDocumentCount();
    let work_count = yield model_2.default.estimatedDocumentCount();
    let travel_count = yield model_3.default.estimatedDocumentCount();
    let bazaar_count = yield model_4.default.estimatedDocumentCount();
    let citation_count = yield model_5.default.estimatedDocumentCount();
    let podcast_count = yield model_6.default.estimatedDocumentCount();
    res.render("admin/index", {
        users_count: users_count,
        work_count: work_count,
        travel_count: travel_count,
        bazaar_count: bazaar_count,
        citation_count: citation_count,
        podcast_count: podcast_count,
    });
}));
exports.default = router;
//# sourceMappingURL=controller.js.map