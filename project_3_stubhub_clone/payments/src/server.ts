import express from "express";

import "express-async-errors";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";

import {
  errorHandler,
  NotFoundError,
  setCurrentUser,
} from "@zeuscoder-public/microservices-course-shared";

const server = express();

server.set("trust proxy", true); // trust incoming nginx proxy requests

// middlewares
server.use(bodyParser.json());
// add a session property to all req objects
server.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // in prod or dev, set cookie session data over https only
  })
);
server.use(setCurrentUser);

// routes

server.all("*", async (req, res) => {
  // catch all route handler
  throw new NotFoundError();
});

server.use(errorHandler); // generic error handler goes last

export { server };
