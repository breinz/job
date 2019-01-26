import { Document, Schema, model, Model, Types } from "mongoose";
import Image, { ImageModel } from "../images/model";

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
    pics: Types.Array<Types.ObjectId | string>,
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
    pics: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    description: String
});

/**
 * Before removing a travel
 * - remove its Image
 * - remove its Images
 */
travelSchema.pre("remove", async function (next) {
    let travel = this as TravelModel;

    // Removes images record
    try {
        let img = await Image.findById(travel.pic) as ImageModel;
        img.remove();
        travel.pics.forEach(async pic => {
            img = await Image.findById(pic) as ImageModel;
            img.remove();
        });
    } catch (err) {
        return next(err);
    }

    next();
})

export const Travel = model("Travel", travelSchema) as Model<Document> & TravelModel;
export default Travel;