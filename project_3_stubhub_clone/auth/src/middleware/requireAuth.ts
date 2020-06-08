import { Request, Response, NextFunction } from "express";
import { NoAuthError } from "../Errors/NoAuthError";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) throw new NoAuthError();

  // else
  next();
};
