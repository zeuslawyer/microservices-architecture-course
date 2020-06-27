import express from "express";

import "express-async-errors";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError } from "@zeuscoder-public/microservices-course-shared";

const server = express();

server.set("trust proxy", true); // trust incoming nginx proxy requests
server.use(bodyParser.json());
server.use(
  // add a session property to all req objects
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test" // in prod or dev, set cookie session data over https only
  })
);

server.all("*", async (req, res) => {
  throw new NotFoundError();
});

server.use(errorHandler); // goes last

export { server };
