import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const setCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session!.jwt) {
    try {
      const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
      req.currentUser = payload;
    } catch (e) {
      next();
    }
  } else {
    return next();
  }
};
