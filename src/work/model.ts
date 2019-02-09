import { Document, Schema, model, Model, Types } from "mongoose";
import Image, { ImageModel } from "../images/model";

let old_pic: string;

// --------------------------------------------------
// Type
// --------------------------------------------------

export type WorkModel = Document & {
    [index: string]: any,
    title: string, title_fr: string, title_en: string,
    url: string,
    tags: string,
    description: string, description_fr: string, description_en: string,
    pic?: Types.ObjectId | string,
};

// --------------------------------------------------
// Schema
// --------------------------------------------------

const workSchema = new Schema({
    title: String, title_fr: String, title_en: String,
    url: String,
    tags: String,
    description: String, description_fr: String, description_en: String,
    pic: {
        type: Schema.Types.ObjectId,
        ref: "Image",
        set: function (value: string) {
            old_pic = this.pic;
            return value;
        }
    }
});

workSchema.pre("save", async function (next) {
    let work = this as WorkModel;

    if (work.isNew) {
        return next();
    }

    // If the image was changed, remove the old one
    if (work.pic !== old_pic) {
        try {
            let img = await Image.findById(old_pic) as ImageModel;
            if (img) {
                img.remove();
            }
        } catch (err) {
            return next(err);
        }
    }

    next();
})

/**
 * Before removing a work
 * - remove its Image
 */
workSchema.pre("remove", async function (next) {
    let work = this as WorkModel;

    // Removes images record
    if (work.pic) {
        try {
            let img = await Image.findById(work.pic) as ImageModel;
            img.remove();
        } catch (err) {
            return next(err);
        }
    }

    next();
})

export const Work = model("Work", workSchema) as Model<Document> & WorkModel;
export default Work;