import { Document, Schema, model, Model } from "mongoose";

// --------------------------------------------------
// Type
// --------------------------------------------------

export type GameModel = Document & {
    name: string,
    width: number,
    height: number,
    js: string
};

// --------------------------------------------------
// Schema
// --------------------------------------------------

const gameSchema = new Schema({
    name: { type: String, unique: true },
    width: { type: Number, default: 800 },
    height: { type: Number, default: 600 },
    js: String
});

export const Game = model("Game", gameSchema) as Model<Document> & GameModel;
export default Game;