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
  res.status(200).json({ success: true, token: registerUser.username });
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
});

// @desc    logout
// @route 	GET /api/v1/auth/logout
// @access  public
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email } = req.body;
    const vorhanden = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (vorhanden) {
      return next(new ErrorResponse(`Diese Vokabel gibt es schon`, 404));
    }
    const neueUser = await User.create(req.body);
    res.status(200).json({ success: true, data: neueUser });
  }
);

// @desc    Get me
// @route 	GET /api/v1/auth/me
// @access  private
export const getMe = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findById(req.params.id);
    if (!user) {
      return next(
        new ErrorResponse(`Dieser User (${req.params.id}) gibt es nicht`, 404)
      );
    }
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: user });
  }
);
