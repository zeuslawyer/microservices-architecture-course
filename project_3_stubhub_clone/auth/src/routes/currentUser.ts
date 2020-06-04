import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/users/currentuser", (req: Request, res: Response) => {
  res.send(`Auth service received GET request on the path ${req.path}`);
});

export { router as currentUserRouter }; // rename router
