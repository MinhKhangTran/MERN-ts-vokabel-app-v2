import express from "express";
import "dotenv/config";
import morgan from "morgan";
import mongoose from "mongoose";
import vokRouter from "./routes/vokabel";
import userRouter from "./routes/users";
import authRouter from "./routes/auth";
import errorHandler from "./middlewares/error";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
// import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";

// Init Express
const app = express();

// Connect DB
mongoose
  .connect(`${process.env.MONGO_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
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

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
// app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Routing
app.use("/api/v1/voks", vokRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

// Errorhandler
app.use(errorHandler);

// Server startet
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🏋️‍♂️`);
});
