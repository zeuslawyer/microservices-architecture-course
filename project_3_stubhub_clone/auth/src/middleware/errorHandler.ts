// reference: https://expressjs.com/en/guide/error-handling.html

import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../Errors/DatabaseConnectionError";
import { RequestValidationError } from "../Errors/RequestValidationError";

export interface Err {
  message: string;
  field?: string;
}
export interface AppError {
  errors: Err[]; // errors is an array of error objects
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof DatabaseConnectionError) {
    const error: AppError = {
      errors: [{ message: err.reason }]
    };

    return res.status(500).send(error as AppError);
  }

  if (err instanceof RequestValidationError) {
    const formattedErrors: Err[] = err.errors.map(e => {
      return {
        message: e.msg,
        field: e.param
      };
    });

    return res.status(400).send({ errors: formattedErrors } as AppError);
  }

  // else
  return res
    .status(400)
    .send({ errors: [{ message: "Something went wrong. " }] } as AppError);
};
