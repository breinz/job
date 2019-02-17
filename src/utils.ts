import * as fs from "fs"
import * as path from "path"
import { UploadedFile } from "express-fileupload";
import Image, { ImageModel } from "./images/model";
const sharp = require("sharp")
const uuid = require("uuid/v4");

/**
 * Const to convert degrees in radians
 */
export const D2R = Math.PI / 180;

/**
 * Const to convert radians in degrees
 */
export const R2D = 180 / Math.PI;

/**
 * Potential sizes for an image
 */
const pic_sizes = ["nano", "mini", "home", "banner"];

/**
 * Sorts a mongoose query
 * @param field The field to sort
 * @param direction The sorting direction
 */
export function sort(field: string, direction: number = 1) {
    let s: { [index: string]: number } = {};
    s[field] = direction;
    return s;
}

/**
 * Shuffles an array
 * @param ar The array to shuffle
 * @return Array<Object>
 */
export function shuffle(ar: Object[]) {
    for (let i = ar.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ar[i], ar[j]] = [ar[j], ar[i]];
    }
    return ar;
}

/**
 * Get the day of the year [0-365]
 */
export function dayOfYear(): number {
    const now: any = new Date();
    const start: any = new Date(now.getFullYear(), 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Determine the distance between two objects
 * @param obj1 First object
 * @param obj2 Second object
 * @param rapid No use of square root
 */
export function distance(obj1: { x: number, y: number }, obj2: { x: number, y: number }, rapid: boolean = false): number {
    if (rapid) {

        return Math.abs(obj1.x - obj2.x) + Math.abs(obj1.y - obj2.y);
    }

    return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
}

/**
 * Create a folder
 * @param url The path from root folder
 */
export function mkdir(url: string) {
    return new Promise((resolve, reject) => {
        fs.mkdir(path.join(__dirname, "../public/", url), err => {
            if (err && err.code !== "EEXIST") {
                reject(err);
                return;
            }
            resolve();
        })
    })
}

export function mv_pic(
    url: string,
    file: UploadedFile,
    name: string = undefined,
    description: string = ""): Promise<string> {

    return new Promise(async (resolve, reject) => {

        let parts = file.name.split('.');
        let fileName = `${uuid()}.${parts[parts.length - 1]}`;
        name = name ? name : fileName;//`${uuid()}.${parts[parts.length - 1]}`;

        await file.mv(path.join(__dirname, "../public/", url, fileName));

        let image = new Image() as ImageModel;
        image.name = name;
        image.description = description;
        image.file = fileName;
        image.url = `/${url}/`;

        await image.save();

        resolve(image.id);
    });
}

export function rm_pic(pic: ImageModel) {
    return new Promise((resolve, reject) => {
        // Delete the original
        fs.unlink(path.join(__dirname, "../public/", pic.url, pic.file), err => {
            if (err) {
                return reject(err);
            }

            // Delete different sizes
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

export function getPic(file: any, size?: string): string {
    // Original
    if (size === undefined || size == "original") return file.url + file.file;

    let resize_data: { width: number, height: number, fit?: string, background?: { r: number, g: number, b: number, alpha: number } };

    resize_data = {
        width: 200,
        height: 200,
        fit: "contain",
        background: { r: 255, g: 0, b: 0, alpha: 0.5 }
    }

    if (size === "nano") {
        resize_data = { width: 20, height: 20 };
    } else if (size === "mini") {
        resize_data = { width: 100, height: 100 };
    } else if (size === "home") {
        resize_data = { width: 200, height: 200 };
    } else if (size === "banner") {
        resize_data = { width: 1800, height: 500 };
    }

    let url = file.url + size + "/" + file.file;

    try {
        // Check if file exists and return it
        fs.accessSync(path.join(__dirname, "../public/", file.url, size, file.file));

        return url;

    } catch (err) {

        try {
            fs.mkdirSync(path.join(__dirname, "../public/", file.url, size));
        } catch (err) {
            if (err.code !== "EEXIST") throw err;
        }

        sharp(path.join(__dirname, "../public/", file.url, file.file))
            .resize(resize_data.width, resize_data.height)
            .toFile(path.join(__dirname, "../public/", file.url, size, file.file));

        return url;
    }
}

export function formatText(txt: string): string {

    if (txt === undefined) return "<p>Translation in progress...</p>"

    let add: string = "";

    // headers at beginning
    txt = txt.replace(/^##([^#]+?)\n/g, "<h4>$1</h4><p>");
    txt = txt.replace(/^#([^#]+?)\n/g, "<h3>$1</h3><p>");

    // If the string doesn't start with a #, start a paragraph
    if (txt.substr(0, 2) !== "<h") {
        txt = "<p>" + txt;
    }

    // bold
    txt = txt.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");

    // italic
    txt = txt.replace(/__([^_]+)__/g, "<i>$1</i>");

    // headers in text
    txt = txt.replace(/##([^#]+?)\n/g, "</p><h4>$1</h4><p>");
    txt = txt.replace(/#([^#]+?)\n/g, "</p><h3>$1</h3><p>");

    // new paragraph
    txt = txt.replace(/\n/g, "</p><p>");

    // img
    let index = 0;
    let all: string[] = [];
    txt = txt.replace(/\[img>([^\]]+)\]/g, function (str, data) {
        var [file, size, visionneuse, align] = data.split(">");

        align = align || "left";

        let rpl: string = `<img class='img-in-text-align-${align}`;
        // visionneuse
        if (visionneuse === "1") rpl += " visionneuse-reveal ";
        // src
        rpl += "' src='";
        rpl += getPic({
            url: "/img/vrac/",
            file: file
        }, size || "mini");
        rpl += "'";
        // data-src
        rpl += ` data-src="/img/vrac/${file}"`;
        if (visionneuse === "1") {
            rpl += ` data-all="txt-pics-all" data-index=${index++}`;
            all.push(`/img/vrac/${file}`);
            //add += `<img class="hidden" src="/img/vrac/${file}" alt=""/>`; // preload
        }
        rpl += "'/>";
        return rpl;
    });
    if (all.length > 0) {
        add += `<div class="hidden" id="txt-pics-all" data-src="${all.join(',')}"></div>`;
    }

    // swf
    txt = txt.replace(/\[swf>([^\]]+)\]/g, function (str, data) {
        var [file, width, height] = data.split(">");
        let rpl: string = `<object type="application/x-shockwave-flash" data="/swf/${file}" width="${width}" height="${height}">`;
        rpl += `<param name="movie" value="/swf/${file}" />`;
        rpl += '<param name="quality" value="high" />';
        rpl += '<div class="text-center callout" style="margin:0 5rem">This is a swf object.  If you see this message, you are viewing this site in a context that doesn\'t support swf or where swf has been blocked.';
        //Here is supposed to lay a swf object, if you see this message, it means you are in a context that doesn\'t support it, or that you blocked it.<br>That\'s why I don\'t make swf for the web anymore :(<br>Try on a computer and allow Flash
        rpl += "</object>";
        return rpl;
    })
    // link
    txt = txt.replace(/\[([^\].]+)>([^\]]+)\]/g, "<a href='$2'>$1</a>");

    return txt + "</p>" + add;
}