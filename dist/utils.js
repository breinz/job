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
const pic_sizes = ["nano", "mini", "home", "banner"];
function shuffle(ar) {
    for (let i = ar.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ar[i], ar[j]] = [ar[j], ar[i]];
    }
    return ar;
}
exports.shuffle = shuffle;
function dayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}
exports.dayOfYear = dayOfYear;
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
function mv_pic(url, file, name = undefined, description = "") {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let parts = file.name.split('.');
        let fileName = `${uuid()}.${parts[parts.length - 1]}`;
        name = name ? name : fileName;
        yield file.mv(path.join(__dirname, "../public/", url, fileName));
        let image = new model_1.default();
        image.name = name;
        image.description = description;
        image.file = fileName;
        image.url = `/${url}/`;
        yield image.save();
        resolve(image.id);
    }));
}
exports.mv_pic = mv_pic;
function rm_pic(pic) {
    return new Promise((resolve, reject) => {
        fs.unlink(path.join(__dirname, "../public/", pic.url, pic.file), err => {
            if (err) {
                return reject(err);
            }
            pic_sizes.forEach(size => {
                fs.unlink(path.join(__dirname, "../public/", pic.url, size, pic.file), err => {
                    if (err && err.code !== "ENOENT") {
                        return reject(err);
                    }
                });
            });
            resolve();
        });
    });
}
exports.rm_pic = rm_pic;
function getPic(file, size) {
    if (size === undefined || size == "original")
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
            .resize(resize_data.width, resize_data.height)
            .toFile(path.join(__dirname, "../public/", file.url, size, file.file));
        return url;
    }
}
exports.getPic = getPic;
function formatText(txt) {
    txt = txt.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
    txt = txt.replace(/__([^_]+)__/g, "<i>$1</i>");
    txt = txt.replace(/\n/g, "</p><p>");
    txt = txt.replace(/\[img>([^\]]+)\]/g, function (str, data) {
        var [file, size, visionneuse, align] = data.split(">");
        align = align || "left";
        let rpl = `<img class='img-in-text-align-${align}`;
        if (visionneuse === "1")
            rpl += " visionneuse-reveal ";
        rpl += "' src='";
        rpl += getPic({
            url: "/img/vrac/",
            file: file
        }, size || "mini");
        rpl += "'";
        rpl += ` data-src="/img/vrac/${file}"`;
        rpl += "'/>";
        return rpl;
    });
    txt = txt.replace(/\[([^\].]+)>([^\]]+)\]/g, "<a href='$2'>$1</a>");
    return txt;
}
exports.formatText = formatText;
//# sourceMappingURL=utils.js.map