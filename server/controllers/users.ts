import User from "../models/User";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse";
import { validationResult } from "express-validator";

// @desc    Get all users
// @route 	GET /api/v1/users
// @access  private/ADMIN
export const getUsers = asyncHandler(async (req, res: any, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single User
// @route 	GET /api/v1/users/:id
// @access  private/ADMIN
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`Dieser User (${req.params.id}) gibt es nicht`, 404)
    );
  }
  res.status(200).json({ success: true, data: user });
});

// @desc    create a User
// @route 	POST /api/v1/users
// @access  private/ADMIN
export const createUser = asyncHandler(
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

// @desc    Update a user
// @route 	PUT /api/v1/users/:id
// @access  private/ADMIN
export const updateUser = asyncHandler(
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

// @desc    delete a User
// @route 	DELETE /api/v1/users/:id
// @access  private/ADMIN
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(
        new ErrorResponse(`Dieser User (${req.params.id}) gibt es nicht`, 404)
      );
    }
    await user.remove();

    res.status(200).json({ success: true, data: {} });
  }
);
