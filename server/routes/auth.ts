import express from "express";
const router = express.Router();
import { check } from "express-validator";
import { register, login, logout, getMe } from "../controllers/auth";
import User from "../models/User";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(getMe);

export default router;
