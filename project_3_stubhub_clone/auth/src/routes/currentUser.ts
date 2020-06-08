import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { setCurrentUser } from "../middleware/setCurrentUser";

const router = express.Router();

/**
 * Route for react app front end to hit to check if a current user is authentication and if so, authorized.
 * Route will check if jwt is on the req.sessions cookie object.
 */
router.get("/api/users/currentuser", setCurrentUser, (req: Request, res: Response) => {
  // req.currentUser is set by the middleware.  Can be undefined if not logged in.abs

  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter }; // rename router
