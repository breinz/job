import { Document, Schema, model, Model, Types } from "mongoose";
import Image, { ImageModel } from "../images/model";

let old_pic: string;

// --------------------------------------------------
// Type
// --------------------------------------------------

export type PodcastModel = Document & {
    [index: string]: any,
    name: string, name_fr: string, name_en: string,
    link: string,
    url: string,
    description: string, description_fr: string, description_en: string,
    pic?: Types.ObjectId | string,
};

// --------------------------------------------------
// Schema
// --------------------------------------------------

const podcastSchema = new Schema({
    name: String, name_fr: String, name_en: String,
    link: String,
    url: String,
    description: String, description_fr: String, description_en: String,
    pic: {
        type: Schema.Types.ObjectId,
        ref: "Image",
        set: function (value: string) {
            old_pic = this.pic;
            return value;
        }
    }
});

podcastSchema.pre("save", async function (next) {
    let podcast = this as PodcastModel;

    if (podcast.isNew) {
        return next();
    }

    // If the image was changed, remove the old one
    if (podcast.pic !== old_pic) {
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
 * Before removing a podcast
 * - remove its Image
 */
podcastSchema.pre("remove", async function (next) {
    let podcast = this as PodcastModel;

    // Removes images record
    if (podcast.pic) {
        try {
            let img = await Image.findById(podcast.pic) as ImageModel;
            img.remove();
        } catch (err) {
            return next(err);
        }
    }

    next();
})

export const Podcast = model("Podcast", podcastSchema) as Model<Document> & PodcastModel;
export default Podcast;