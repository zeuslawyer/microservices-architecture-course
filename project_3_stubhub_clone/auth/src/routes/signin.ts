import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { handleRequestValidation, BadRequestError } from "@zeuscoder-public/microservices-course-shared";
import { User } from "../Models/User";
import { PasswordManager } from "../services/PasswordManager";

const router = express.Router();

const validation = [
  body("email").isEmail().withMessage("Please provide a valid email address for signing in."),
  body("password").trim().notEmpty().withMessage("Please provide your password to sign in.")
];

router.post(
  "/api/users/signin",
  validation, // apply validation rules
  handleRequestValidation, // run validation test
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // check if user exists
    const u = await User.findOne({ email });
    if (u === null) throw new BadRequestError(`No user with email ${email} found`);

    // else check password
    const doesMatch = await PasswordManager.doesMatch(u.password, password);
    if (!doesMatch) throw new BadRequestError("You have entered an incorrect password");

    // else all good, send session cookie with JWT
    // generate and save JWT cookie session object
    const userJwt = jwt.sign(
      {
        id: u.id,
        email: u.email
      },
      process.env.JWT_KEY! // jwt secret
    );

    // @ts-ignore
    // apply the jwt to the session cookie
    req.session.jwt = userJwt; // ! means we are sure we checked (check is in index.ts)

    res.status(200).send(u);
  }
);

export { router as signinRouter }; // rename router
