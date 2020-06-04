// reference: https://expressjs.com/en/guide/error-handling.html

import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../Errors/DatabaseConnectionError";
import { RequestValidationError } from "../Errors/RequestValidationError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    return res.status(400).send({ errors: err.serializeErrors() });
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // else
  return res
    .status(400)
    .send({ errors: [{ message: "Something went wrong. " }] });
};
