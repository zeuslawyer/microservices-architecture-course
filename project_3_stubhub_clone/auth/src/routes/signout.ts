import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/users/signout", (req: Request, res: Response) => {
  res.send(`sign out service received post request on the path ${req.path}`);
});

export { router as signoutRouter }; // rename router
