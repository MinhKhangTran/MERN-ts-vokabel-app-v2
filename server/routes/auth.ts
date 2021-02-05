import express from "express";
const router = express.Router();
import { check } from "express-validator";
import { register, login, getMe } from "../controllers/auth";
import User from "../models/User";
import { protect } from "../middlewares/auth";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(protect, getMe);

export default router;
