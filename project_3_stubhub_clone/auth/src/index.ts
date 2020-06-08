import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/currentUser";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middleware/errorHandler";
import { DatabaseConnectionError } from "./Errors/DatabaseConnectionError";

const PORT = 3010;
const app = express();
app.set("trust proxy", true); // trust incoming nginx proxy requests
app.use(bodyParser.json());
app.use(
  // add a session property to all req objects
  cookieSession({
    signed: false,
    secure: true // https only
  })
);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(errorHandler); // goes last

app.get("/test-path", (req, res) => {
  res.json({});
});

const init = async () => {
  // check env vars
  if (!process.env.JWT_KEY) throw new Error(" MISSING ENV VAR JWT_KEY ");

  // mongoose
  try {
    await mongoose.connect("mongodb://auth-mongo-clusterip:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  } catch (error) {
    throw new DatabaseConnectionError();
  }

  // server
  app.listen(PORT, () => {
    console.info("Auth Service Listening On Port", PORT);
  });
};

init();