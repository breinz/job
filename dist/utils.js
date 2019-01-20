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
const fs = require("fs");
const path = require("path");
const model_1 = require("./images/model");
const sharp = require("sharp");
const uuid = require("uuid/v4");
exports.D2R = Math.PI / 180;
exports.R2D = 180 / Math.PI;
function shuffle(ar) {
    for (let i = ar.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ar[i], ar[j]] = [ar[j], ar[i]];
    }
    return ar;
}
exports.shuffle = shuffle;
function distance(obj1, obj2, rapid = false) {
    if (rapid) {
        return Math.abs(obj1.x - obj2.x) + Math.abs(obj1.y - obj2.y);
    }
    return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
}
exports.distance = distance;
function mkdir(url) {
    return new Promise((resolve, reject) => {
        fs.mkdir(path.join(__dirname, "../public/", url), err => {
            if (err && err.code !== "EEXIST") {
                reject(err);
                return;
            }
            resolve();
        });
    });
}
exports.mkdir = mkdir;
function mv_pic(url, file) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let parts = file.name.split('.');
        let name = `${uuid()}.${parts[parts.length - 1]}`;
        yield file.mv(path.join(__dirname, "../public/", url, name));
        let image = new model_1.default();
        image.name = file.name;
        image.file = name;
        image.url = `/${url}/`;
        yield image.save();
        resolve(image.id);
    }));
}
exports.mv_pic = mv_pic;
function getPic(file, size) {
    if (size === undefined)
        return file.url + file.file;
    let resize_data;
    resize_data = {
        width: 200,
        height: 200,
        fit: "contain",
        background: { r: 255, g: 0, b: 0, alpha: 0.5 }
    };
    if (size === "nano") {
        resize_data = { width: 20, height: 20 };
    }
    else if (size === "mini") {
        resize_data = { width: 100, height: 100 };
    }
    else if (size === "home") {
        resize_data = { width: 200, height: 200 };
    }
    else if (size === "banner") {
        resize_data = { width: 1800, height: 500 };
    }
    let url = file.url + size + "/" + file.file;
    try {
        fs.accessSync(path.join(__dirname, "../public/", file.url, size, file.file));
        return url;
    }
    catch (err) {
        try {
            fs.mkdirSync(path.join(__dirname, "../public/", file.url, size));
        }
        catch (err) {
            if (err.code !== "EEXIST")
                throw err;
        }
        sharp(path.join(__dirname, "../public/", file.url, file.file))
            .resize(resize_data)
            .toFile(path.join(__dirname, "../public/", file.url, size, file.file));
        return url;
    }
}
exports.getPic = getPic;
//# sourceMappingURL=utils.js.map