import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../Models/User";
import { BadRequestError, handleRequestValidation } from "@zeuscoder-public/microservices-course-shared";

const router = express.Router();

// middleware validation array of funcs
const validation = [
  body("email").isEmail().withMessage("Email must be valid."),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Please enter a valid password between 4 and 20 characters long.")
];

router.post(
  "/api/users/signup",
  validation, // apply validation rules
  handleRequestValidation, // run validation tests
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    // check if already registered
    if (existingUser) {
      throw new BadRequestError("Email is already registered.");
    }

    // else, create and save
    const newUser = User.build({
      email,
      password
    });

    await newUser.save();

    // generate and save JWT cookie session object
    const secret = process.env.JWT_KEY!; // jwt secret
    const userJwt = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email
      },
      secret
    );

    // @ts-ignore
    // apply the jwt to the session cookie
    // send back on response header
    req.session.jwt = userJwt; // ! means we are sure we checked (check is in index.ts)

    res.status(201).send(newUser);
  }
);

export { router as signupRouter }; // rename router
