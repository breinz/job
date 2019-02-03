import { Document, Schema, model, Model, Types } from "mongoose";

// --------------------------------------------------
// Type
// --------------------------------------------------

export type CitationModel = Document & {
    content: string,
    source: string
};

// --------------------------------------------------
// Schema
// --------------------------------------------------

const citationSchema = new Schema({
    content: String,
    source: String
});

export const Citation = model("Citation", citationSchema) as Model<Document> & CitationModel;
export default Citation;