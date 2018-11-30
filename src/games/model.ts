import { Document, Schema, model, Model } from "mongoose";

// --------------------------------------------------
// Type
// --------------------------------------------------

export type GameModel = Document & {
    name: string,
};

// --------------------------------------------------
// Schema
// --------------------------------------------------

const gameSchema = new Schema({
    name: { type: String, unique: true }

});

export const Game = model("Game", gameSchema) as Model<Document> & GameModel;
export default Game;