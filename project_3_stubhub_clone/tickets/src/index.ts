import mongoose from "mongoose";
import { server } from "./server";
import { DatabaseConnectionError } from "@zeuscoder-public/microservices-course-shared";

const PORT = 3020;

const init = async () => {
  // check env vars
  if (!process.env.JWT_KEY) throw new Error(" MISSING ENV VAR JWT_KEY "); // defined in the -depl yaml
  if (!process.env.MONGO_URI) throw new Error(" MISSING ENV VAR MONGO_URI in TICKETS"); // defined in the -depl yaml

  // mongoose
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  } catch (error) {
    throw new DatabaseConnectionError();
  }

  // server
  server.listen(PORT, () => {
    console.info("Tickets Service Listening On Port", PORT);
  });
};

init();
