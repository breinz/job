import { Document, Schema, model, Model } from "mongoose";
import { rm_pic } from "../utils";

// --------------------------------------------------
// Type
// --------------------------------------------------

export type ImageModel = Document & {
    name: string,
    description: string,
    file: string,
    url: string,

    original: () => string
};

// --------------------------------------------------
// Schema
// --------------------------------------------------

const imageSchema = new Schema({
    name: String,
    description: String,
    file: String,
    url: String
});

imageSchema.statics.original = function () {
    return this.url + this.file;
}

/**
 * Before removing an image
 * - Delete files
 */
imageSchema.pre("remove", async function (next) {
    try {
        await rm_pic(<ImageModel>this);
    } catch (err) {
        return next(err);
    }

    next();
})

export const Image = model("Image", imageSchema) as Model<Document> & ImageModel;
export default Image;