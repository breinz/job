import * as fs from "fs"
import * as path from "path"
import { UploadedFile } from "express-fileupload";
import Image, { ImageModel } from "./images/model";
//const sharp = require("sharp")
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

export function mv_pic(url: string, file: UploadedFile): Promise<string> {
    return new Promise(async (resolve, reject) => {

        let parts = file.name.split('.');
        let name = `${uuid()}.${parts[parts.length - 1]}`;

        await file.mv(path.join(__dirname, "../public/", url, name));

        let image = new Image() as ImageModel;
        image.name = file.name;
        image.file = name;
        image.url = `/${url}/`;

        await image.save();

        resolve(image.id);
    });
}

export function getPic(file: any, size?: string): string {
    // Original
    if (size === undefined) return file.url + file.file;

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

        /*sharp(path.join(__dirname, "../public/", file.url, file.file))
            .resize(resize_data)
            .toFile(path.join(__dirname, "../public/", file.url, size, file.file));*/

        return url;
    }
}