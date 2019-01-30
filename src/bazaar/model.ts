import { Document, Schema, model, Model, Types } from "mongoose";

// --------------------------------------------------
// Type
// --------------------------------------------------

export type BazaarModel = Document & {
    /**
     * Title of the page
     */
    title: string,
    /**
     * The text used to form the url in the navigator
     */
    url: string,
    /**
     * The text used for the link
     */
    link: string,
    parent?: Types.ObjectId | string,
    description: string,

    children?: [BazaarModel]
};

// --------------------------------------------------
// Schema
// --------------------------------------------------

const bazaarSchema = new Schema({
    title: String,
    url: String,
    link: String,
    parent: { type: Schema.Types.ObjectId, ref: "Bazaar" },
    description: String
});

export const Bazaar = model("Bazaar", bazaarSchema) as Model<Document> & BazaarModel;
export default Bazaar;