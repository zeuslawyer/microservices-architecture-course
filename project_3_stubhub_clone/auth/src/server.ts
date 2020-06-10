import express from "express";

import "express-async-errors";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/currentUser";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middleware/errorHandler";

export const server = express();

server.set("trust proxy", true); // trust incoming nginx proxy requests
server.use(bodyParser.json());
server.use(
  // add a session property to all req objects
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test" // in prod or dev, set cookie session data over https only
  })
);
server.use(currentUserRouter);
server.use(signinRouter);
server.use(signupRouter);
server.use(signoutRouter);
server.use(errorHandler); // goes last

server.get("/test-path", (req, res) => {
  res.json({});
});
