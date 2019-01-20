import { Document, Schema, model, Model } from "mongoose";

// --------------------------------------------------
// Type
// --------------------------------------------------

export type ImageModel = Document & {
    name: string,
    file: string,
    url: string,

    original: () => string
};

// --------------------------------------------------
// Schema
// --------------------------------------------------

const imageSchema = new Schema({
    name: String,
    file: String,
    url: String
});

imageSchema.statics.original = function () {
    return this.url + this.file;
}

export const Image = model("Image", imageSchema) as Model<Document> & ImageModel;
export default Image;