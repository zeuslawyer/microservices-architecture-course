import express, { Request, Response } from "express";

const router = express.Router();

/**
 * tell the browser to dump the cookie with its jwt, in the browser.
 * Destroys the session.
 */
router.post("/api/users/signout", async (req: Request, res: Response) => {
  // see cookie-sessions docs for destroying session
  req.session = null; // the cookie expiry gets set to way in the past

  res.status(200).send("Signed out.");
});

export { router as signoutRouter }; // rename router
