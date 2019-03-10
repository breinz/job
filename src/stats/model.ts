import { Document, Schema, model, Model } from "mongoose";

// --------------------------------------------------
// Type
// --------------------------------------------------

export type StatModel = Document & {
    date: Date,
    path: string,
    ip: string,
    country: string, countryCode: string, region: string, regionName: string, city: string,
};

// --------------------------------------------------
// Schema
// --------------------------------------------------

const statSchema = new Schema({
    date: Date,
    path: String,
    ip: String,
    country: String, countryCode: String, region: String, regionName: String, city: String,
});

export const Stat = model("Stat", statSchema) as Model<Document> & StatModel;
export default Stat;