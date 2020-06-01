// reference: https://expressjs.com/en/guide/error-handling.html

import { Request, Response, NextFunction } from "express"

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Something went wrong", err)
  res.status(400).send({ error: err.message })
}
