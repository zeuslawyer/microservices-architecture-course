import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../Errors/RequestValidationError";

// non-error handling middleware accepts 4 args, with Error arg being the additional one

export const handleRequestValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req); // check requests for validation errors
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};
