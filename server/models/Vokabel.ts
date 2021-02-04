import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IVokabel extends Document {
  deutsch: string;
  koreanisch: string;
  like: boolean;
  user: IUser;
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
  like: {
    type: Boolean,
    default: false,
  },
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
