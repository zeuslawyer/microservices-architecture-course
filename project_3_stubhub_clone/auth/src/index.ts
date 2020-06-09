import mongoose from "mongoose";
import { server } from "./server";
import { DatabaseConnectionError } from "./Errors/DatabaseConnectionError";

const PORT = 3010;

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
  server.listen(PORT, () => {
    console.info("Auth Service Listening On Port", PORT);
  });
};

init();
