import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();

import { RequestValidationError } from "../Errors/RequestValidationError";
import { User } from "../Models/User";

// middleware validation array of funcs
const validation = [
  body("email").isEmail().withMessage("Email must be valid."),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage(
      "Please enter a valid password between 4 and 20 characters long."
    )
];

router.post(
  "/api/users/signup",
  validation,
  async (req: Request, res: Response) => {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    // check if already registered
    if (existingUser) {
      console.log("WARNING:   Email in use. Cannot create user.");
      return res.send({});
    }

    // else, create and save
    const newUser = User.build({
      email,
      password
    });

    await newUser.save();
    res.status(201).send(newUser);
  }
);

export { router as signupRouter }; // rename router
