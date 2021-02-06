import User from "../models/User";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse";
import { validationResult } from "express-validator";
import Vokabel from "../models/Vokabel";

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

// @desc    toggle like
// @route 	PUT /api/v1/users/:id/me
// @access  private
export const putToFav = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const vokabel = await Vokabel.findById(req.params.id);
    if (!vokabel) {
      return next(
        new ErrorResponse(`Diese Vokabel (${req.params.id}) gibt es nicht`, 404)
      );
    }

    const likedVoks = req.user.likedVok;
    const isInclude = likedVoks.indexOf(vokabel._id);
    console.log(likedVoks);
    console.log(isInclude);
    console.log(vokabel._id);

    // Wenn vorhanden
    if (isInclude >= 0) {
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { likedVok: vokabel._id },
        },
        { new: true }
      );
      res.status(200).json({
        success: true,

        likedVok: req.user.likedVok,
      });
      // wenn nicht
    } else {
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { likedVok: vokabel._id },
        },
        { new: true }
      );
      res.status(200).json({
        success: true,
        likedVok: req.user.likedVok,
      });
    }
  }
);

// @desc    Get liked ones
// @route 	GET /api/v1/users/liked
// @access  private
export const getLikedOnes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id).populate("likedVok");
    res.status(200).json({ success: true, data: user });
  }
);

// @desc    Get liked ones
// @route 	GET /api/v1/users/:id/liked
// @access  private
export const getLikedList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const vokabel = await Vokabel.find();
    console.log(vokabel);
    const userSearch = await User.find({ _id: { $in: vokabel.likedBy } });

    res.status(200).json({ success: true, data: userSearch });
  }
);
