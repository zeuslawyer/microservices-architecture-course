import mongoose from "mongoose";
import { server } from "./server";
import { DatabaseConnectionError } from "@zeuscoder-public/microservices-course-shared";

const PORT = 3000;

const init = async () => {
  // check env vars
  if (!process.env.JWT_KEY) throw new Error(" MISSING ENV VAR JWT_KEY ");
  if (!process.env.MONGO_URI)
    throw new Error(" MISSING ENV VAR MONGO_URI in AUTH ");

  // mongoose
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (error) {
    console.error("AUTH ERROR:   Failed to Connect to Database");
    throw new DatabaseConnectionError();
  }

  // server
  server.listen(PORT, () => {
    console.info("*** Auth Service Listening On Port ->", PORT);
  });
};

init();
