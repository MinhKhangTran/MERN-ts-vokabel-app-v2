// protected and admin middleware

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    export interface Request {
      user: IUser;
    }
  }
}

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new ErrorResponse(`Du bist nicht angemeldet! Bitte anmelden`, 401)
      );
    }
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
    // console.log(decoded);
    req.user = await User.findById((<any>decoded)._id);
    // console.log(req.user);
    next();
  }
);

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role) {
    next();
  } else {
    return next(new ErrorResponse("Du hast keine Rechte dazu", 401));
  }
};
