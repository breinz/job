import { Document, Schema, model, Model, Types } from "mongoose";

// --------------------------------------------------
// Type
// --------------------------------------------------

export type TravelModel = Document & {
    name: string,
    title: string,
    url: string,
    parent?: Types.ObjectId | string,
    description: string,
    pic?: Types.ObjectId | string,
    children?: [TravelModel]
};

// --------------------------------------------------
// Schema
// --------------------------------------------------

const travelSchema = new Schema({
    name: String,
    title: String,
    url: String,
    parent: { type: Schema.Types.ObjectId, ref: "Travel" },
    pic: { type: Schema.Types.ObjectId, ref: "Image" },
    description: String
});

export const Travel = model("Travel", travelSchema) as Model<Document> & TravelModel;
export default Travel;