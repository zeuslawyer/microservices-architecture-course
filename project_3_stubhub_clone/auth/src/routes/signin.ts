import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../Errors/RequestValidationError";

const router = express.Router();

const validation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address for signing in."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Please provide your password to sign in.")
];
router.post(
  "/api/users/signin",
  validation,
  async (req: Request, res: Response) => {
    // handle validation errors on input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    res.status(200);
  }
);

export { router as signinRouter }; // rename router
