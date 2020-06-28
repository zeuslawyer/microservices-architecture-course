import express from "express";

import "express-async-errors";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, setCurrentUser } from "@zeuscoder-public/microservices-course-shared";
import { createTicketRouter } from "./routes/newTicket";

const server = express();

server.set("trust proxy", true); // trust incoming nginx proxy requests

// middlewares
server.use(bodyParser.json());
// add a session property to all req objects
server.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test" // in prod or dev, set cookie session data over https only
  })
);
server.use(setCurrentUser);

// routes
server.use(createTicketRouter);

server.all("*", async (req, res) => {
  throw new NotFoundError();
});

server.use(errorHandler); // goes last

export { server };
