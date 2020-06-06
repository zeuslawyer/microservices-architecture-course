import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { currentUserRouter } from "./routes/currentUser";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middleware/errorHandler";
import { NotFoundError } from "./Errors/NotFoundError";
import { DatabaseConnectionError } from "./Errors/DatabaseConnectionError";

const PORT = 3010;
const app = express();
app.use(bodyParser.json());
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(errorHandler); // goes last

app.get("/test-path", (req, res) => {
  res.json({});
});

const init = async () => {
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
