import User from "../models/User";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse";
import { validationResult } from "express-validator";

// @desc    Register
// @route 	POST /api/v1/auth/register
// @access  public
export const register = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, email, password } = req.body;
  const vorhanden = await User.findOne({ $or: [{ username }, { email }] });
  if (vorhanden) {
    return next(
      new ErrorResponse(`Dieser User (${req.params.id}) gibt es schon!`, 404)
    );
  }
  const registerUser = await User.create({ username, email, password });
  const token = registerUser.genToken();
  registerUser.save();
  res.status(200).json({ success: true, token });
});

// @desc    Login
// @route 	POST /api/v1/auth/login
// @access  public
export const login = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const vorhanden = await User.findOne({ email });
  if (!vorhanden) {
    return next(
      new ErrorResponse(`Dieser User (${req.params.id}) gibt es nicht!`, 404)
    );
  }
  if (vorhanden && !vorhanden.matchPassword(password)) {
    return next(new ErrorResponse(`Passwort ist falsch!`, 404));
  }
  const token = vorhanden.genToken();
  res.status(200).json({ success: true, token });
});

// @desc    Get me
// @route 	GET /api/v1/auth/me
// @access  private
export const getMe = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = req.user;
    res.status(200).json({ succes: true, data: user });
  }
);
