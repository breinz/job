import { Document, Schema, model, Model, Types } from "mongoose";
import Image, { ImageModel } from "../images/model";

let old_pic: string;
// --------------------------------------------------
// Type
// --------------------------------------------------

export type TravelModel = Document & {
    [index: string]: any,
    name: string, name_fr: string, name_en: string,
    title: string, title_fr: string, title_en: string,
    url: string,
    parent?: Types.ObjectId | string,
    description: string, description_fr: string, description_en: string,
    pic?: Types.ObjectId | string,
    pics: Types.Array<Types.ObjectId | string>,
    children?: [TravelModel]
};

// --------------------------------------------------
// Schema
// --------------------------------------------------

const travelSchema = new Schema({
    name: String, name_fr: String, name_en: String,
    title: String, title_fr: String, title_en: String,
    url: String,
    parent: { type: Schema.Types.ObjectId, ref: "Travel" },
    pic: {
        type: Schema.Types.ObjectId,
        ref: "Image",
        set: function (value: string) {
            old_pic = this.pic;
            return value;
        }
    },
    pics: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    description: String, description_fr: String, description_en: String
});

/**
 * Before save
 * - if the pic was changed, remove the old one
 */
travelSchema.pre("save", async function (next) {
    let travel = this as TravelModel;

    if (travel.isNew) {
        return next();
    }

    // If the image was changed, remove the old one
    if (travel.pic !== old_pic) {
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
 * Before removing a travel
 * - remove its Image
 * - remove its Images
 */
travelSchema.pre("remove", async function (next) {
    let travel = this as TravelModel;

    // Removes images record
    try {
        let img: ImageModel;
        if (travel.pic) {
            img = await Image.findById(travel.pic) as ImageModel;
            if (img) {
                img.remove();
            }
        }

        travel.pics.forEach(async pic => {
            img = await Image.findById(pic) as ImageModel;
            if (img) {
                img.remove();
            }
        });
    } catch (err) {
        return next(err);
    }

    next();
})

export const Travel = model("Travel", travelSchema) as Model<Document> & TravelModel;
export default Travel;