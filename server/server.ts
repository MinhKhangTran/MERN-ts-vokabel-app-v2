import express from "express";
import "dotenv/config";
import colors from "colors";
import morgan from "morgan";
import mongoose from "mongoose";

// Init Express
const app = express();

// Connect DB
mongoose
  .connect(`${process.env.MONGO_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB 🙈");
  })
  .catch((error) => {
    console.log(error);
  });

// Morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// using bodyparser
app.use(express.json());

// Routing
app.get("/", (req, res) => {
  res.send("Hello world");
});

// Server startet
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🏋️‍♂️`);
});
