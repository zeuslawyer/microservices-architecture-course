import express, { Request, Response } from "express";
import { body } from "express-validator";
import { handleRequestValidation } from "../middleware/handleRequestValidation";

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
  validation, // apply validation rules
  handleRequestValidation, // run validation test
  async (req: Request, res: Response) => {
    res.status(200);
  }
);

export { router as signinRouter }; // rename router
