import { Document, Schema, model, Model, Types } from "mongoose";

// --------------------------------------------------
// Type
// --------------------------------------------------

export type BazaarModel = Document & {
    title: string,
    url: string,
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
    parent: { type: Schema.Types.ObjectId, ref: "Bazaar" },
    description: String
});

export const Bazaar = model("Bazaar", bazaarSchema) as Model<Document> & BazaarModel;
export default Bazaar;