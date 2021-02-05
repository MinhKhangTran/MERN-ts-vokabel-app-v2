import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IVokabel extends Document {
  deutsch: string;
  koreanisch: string;
  likeCount: number;
  likedBy: IUser[];
  user: IUser;
  date: string;
}
const VokSchema: Schema = new mongoose.Schema({
  deutsch: {
    type: String,
    maxlength: 100,
    trim: true,
    lowercase: true,
  },
  koreanisch: {
    type: String,
    maxlength: 100,
    trim: true,
    lowercase: true,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Vokabel = mongoose.model<IVokabel>("Vokabel", VokSchema);
export default Vokabel;
