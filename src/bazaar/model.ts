import { Document, Schema, model, Model, Types } from "mongoose";
import Image, { ImageModel } from "../images/model";

// --------------------------------------------------
// Type
// --------------------------------------------------

export type BazaarModel = Document & {
    [index: string]: any,
    /**
     * Title of the page
     */
    title: string, title_fr: string, title_en: string,
    /**
     * The text used to form the url in the navigator
     */
    url: string,
    /**
     * The text used for the link
     */
    link: string, link_fr: string, link_en: string,

    parent?: Types.ObjectId | string,
    description: string, description_fr: string, description_en: string,

    pics: Types.Array<Types.ObjectId | string | ImageModel>,

    children?: [BazaarModel]
};

// --------------------------------------------------
// Schema
// --------------------------------------------------

const bazaarSchema = new Schema({
    title: String, title_fr: String, title_en: String,
    url: String,
    link: String, link_fr: String, link_en: String,
    parent: { type: Schema.Types.ObjectId, ref: "Bazaar" },
    description: String, description_fr: String, description_en: String,
    pics: [{ type: Schema.Types.ObjectId, ref: "Image" }],
});

/**
 * Before remove
 * - remove its images
 */
bazaarSchema.pre("remove", async function (next) {
    console.log("pre remove bazaar");
    let item = this as BazaarModel;

    // Removes images record
    try {
        let img: ImageModel;

        item.pics.forEach(async pic => {
            img = await Image.findById(pic) as ImageModel;
            if (img) {
                img.remove();
            }
        });
    } catch (err) {
        return next(err);
    }

    next();
});

export const Bazaar = model("Bazaar", bazaarSchema) as Model<Document> & BazaarModel;
export default Bazaar;