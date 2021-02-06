import mongoose from "mongoose";
import "dotenv/config";
import User from "./models/User";
import Vokabel from "./models/Vokabel";

// Connect DB
mongoose.connect(`${process.env.MONGO_URI}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Vokabel.deleteMany();
    console.log("Daten wurden vernichtet!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

deleteData();
