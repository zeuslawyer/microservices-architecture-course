import express, { Request, Response } from "express";

const router = express.Router();

/**
 * tell the browser to dump the cookie with its jwt, in the browser.
 * Destroys the session.
 */
router.post("/api/users/signout", async (req: Request, res: Response) => {
  req.session = null; // see cookie-sesions docs for destroying session

  res.status(200).send("Signed out.");
});

export { router as signoutRouter }; // rename router
