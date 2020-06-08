// reference: https://expressjs.com/en/guide/error-handling.html

import { Request, Response, NextFunction } from "express";
import { CustomErrorBase } from "../Errors/CustomErrorBase";

// error handling middleware accepts 4 args, with Error arg being the additional one
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomErrorBase) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // else
  return res.status(400).send({ errors: [{ message: "Something went wrong. " }] });
};
