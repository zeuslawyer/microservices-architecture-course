import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * Route for react app front end to hit to check if a current user is authentication and if so, authorized.
 * Route will check if jwt is on the req.sessions cookie object.
 */
router.get("/api/users/currentuser", (req: Request, res: Response) => {
  // check if user is logged in/ has a session
  const userSessionExists = !!req.session?.jwt;
  if (!userSessionExists)
    return res.send({
      currentUser: null
    });

  // check jwt is intact
  try {
    const payload = jwt.verify(req.session!.jwt, process.env.JWT_KEY!);
    res.send({ currentUser: payload });
  } catch (error) {
    return res.send({
      currentUser: null
    });
  }
});

export { router as currentUserRouter }; // rename router
