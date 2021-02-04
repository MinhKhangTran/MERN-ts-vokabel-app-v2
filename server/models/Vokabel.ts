import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

interface IVokabel extends Document {
  deutsch: string;
  koreanisch: string;
  like: boolean;
  user: IUser;
}
const VokSchema: Schema = new mongoose.Schema({
  deutsch: {
    type: String,
    maxlength: 100,
  },
  koreanisch: {
    type: String,
    maxlength: 100,
  },
  like: {
    type: Boolean,
    default: false,
  },
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // },
});

const Vokabel = mongoose.model<IVokabel>("Vokabel", VokSchema);
export default Vokabel;
