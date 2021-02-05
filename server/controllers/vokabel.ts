import Vokabel from "../models/Vokabel";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import User from "../models/User";

// @desc    Get all Voks
// @route 	GET /api/v1/voks
// @access  public
export const getVoks = asyncHandler(async (req, res: any, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single Vok
// @route 	GET /api/v1/voks/:id
// @access  public
export const getVok = asyncHandler(async (req, res, next) => {
  const vokabel = await Vokabel.findById(req.params.id);
  if (!vokabel) {
    return next(
      new ErrorResponse(`Diese Vokabel (${req.params.id}) gibt es nicht`, 404)
    );
  }
  res.status(200).json({ success: true, data: vokabel });
});

// @desc    Get liked Voks
// @route 	GET /api/v1/voks/me/:id
// @access  private
export const getLikedVoks = asyncHandler(async (req, res, next) => {
  req.body.user = req.user._id;
  const voks = await Vokabel.find({});
  const user = await User.findById(req.params.id);
  res.status(200).json({ success: true, data: user });
});

// @desc    create a Vok
// @route 	POST /api/v1/voks
// @access  private
export const createVok = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    req.body.user = req.user._id;

    const { koreanisch, deutsch } = req.body;
    const vorhanden = await Vokabel.findOne({
      $or: [{ koreanisch }, { deutsch }],
    });
    if (vorhanden) {
      return next(new ErrorResponse(`Diese Vokabel gibt es schon`, 404));
    }
    const neueVokabel = await Vokabel.create(req.body);
    res.status(200).json({ success: true, data: neueVokabel });
  }
);

// @desc    Update a vok
// @route 	PUT /api/v1/voks/:id
// @access  private
export const updateVok = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let vokabel = await Vokabel.findById(req.params.id);
    if (!vokabel) {
      return next(
        new ErrorResponse(`Diese Vokabel (${req.params.id}) gibt es nicht`, 404)
      );
    }
    // Check for user
    if (
      vokabel.user.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "admin"
    ) {
      console.log(typeof vokabel.user.toString());
      console.log(typeof req.user._id);
      return next(new ErrorResponse(`Diese Vokabel gehört dir nicht!`, 404));
    }

    vokabel = await Vokabel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: vokabel });
  }
);

// @desc    delete a vok
// @route 	DELETE /api/v1/voks/:id
// @access  private
export const deleteVok = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const vokabel = await Vokabel.findById(req.params.id);
    if (!vokabel) {
      return next(
        new ErrorResponse(`Diese Vokabel (${req.params.id}) gibt es nicht`, 404)
      );
    }
    // Check for user
    if (
      vokabel.user.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "admin"
    ) {
      return next(new ErrorResponse(`Diese Vokabel gehört dir nicht!`, 404));
    }
    await vokabel.remove();

    res.status(200).json({ success: true, data: {} });
  }
);

// @desc    toggle like
// @route 	PUT /api/v1/voks/:id/liked
// @access  private
export const toggleLike = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const vokabel = await Vokabel.findById(req.params.id);
    if (!vokabel) {
      return next(
        new ErrorResponse(`Diese Vokabel (${req.params.id}) gibt es nicht`, 404)
      );
    }

    const hasUser = vokabel.likedBy.indexOf(req.user._id.toString());
    console.log(vokabel.likedBy, typeof vokabel.likedBy);
    console.log(req.user._id, typeof req.user._id);
    console.log(
      mongoose.Types.ObjectId(req.user._id),
      typeof mongoose.Types.ObjectId(req.user._id)
    );
    // Wenn vorhanden
    if (hasUser >= 0) {
      await Vokabel.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likedBy: req.user._id },
          $inc: { likeCount: -1 },
        },
        { new: true }
      );
      res.status(200).json({
        success: true,
        likes: vokabel.likeCount,
        likedBy: vokabel.likedBy,
      });
      // wenn nicht
    } else {
      await Vokabel.findByIdAndUpdate(
        req.params.id,
        {
          $push: { likedBy: req.user._id },
          $inc: { likeCount: 1 },
        },
        { new: true }
      );
      res.status(200).json({
        success: true,
        likes: vokabel.likeCount,
        likedBy: vokabel.likedBy,
      });
    }
    // Check if liked by user
    // if (vokabel.likedBy.includes(req.user._id.toString())) {
    //   console.log("Du likest diesen Post schon");
    //   vokabel.likeCount--;
    //   vokabel.likedBy.filter(
    //     (person: string) => person !== req.user._id.toString()
    //   );
    //   res
    //     .status(200)
    //     .json({
    //       success: true,
    //       likes: vokabel.likeCount,
    //       likedBy: vokabel.likedBy,
    //     });
    // } else {
    //   console.log("first like");
    //   vokabel.likeCount++;
    //   vokabel.likedBy.push(req.user._id.toString());
    //   res
    //     .status(200)
    //     .json({
    //       success: true,
    //       likes: vokabel.likeCount,
    //       likedBy: vokabel.likedBy,
    //     });
    // }
  }
);
