import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}
export const setCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.session!.jwt) {
    try {
      const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;

      req.currentUser = payload;
    } catch (e) {
      next();
    }
  } else {
    return next();
  }
};
