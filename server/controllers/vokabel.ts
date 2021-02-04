import Vokabel from "../models/Vokabel";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse";
import { validationResult } from "express-validator";

// @desc    Get all Voks
// @route 	GET /api/v1/voks
// @access  public
export const getVoks = asyncHandler(async (req, res, next) => {
  const vokabels = await Vokabel.find({}).sort({ date: 1 });
  res.status(200).json({ success: true, data: vokabels });
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

// @desc    create a Vok
// @route 	POST /api/v1/voks
// @access  private
export const createVok = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
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
    await vokabel.remove();

    res.status(200).json({ success: true, data: {} });
  }
);
