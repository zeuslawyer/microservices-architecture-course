import mongoose from "mongoose";
import { DatabaseConnectionError } from "@zeuscoder-public/microservices-course-shared";
import { randomBytes } from "crypto";

import { natsWrapper } from "./nats-wrapper";
import { server } from "./server";

const PORT = 3020;

const init = async () => {
  // check env vars
  if (!process.env.JWT_KEY) throw new Error(" MISSING ENV VAR JWT_KEY "); // defined in the -depl yaml
  if (!process.env.MONGO_URI) throw new Error(" MISSING ENV VAR MONGO_URI in TICKETS"); // defined in the -depl yaml

  try {
    // mongoose
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    // NATS server
    const clientId = randomBytes(4).toString("hex");
    const clusterId = "tickets"; // taken from the nats-depl config -cid
    const url = "http://nats-clusterip:4222"; // taken from depl service name
    natsWrapper.connect(clusterId, clientId, url);
  } catch (error) {
    throw new DatabaseConnectionError();
  }

  // server
  server.listen(PORT, () => {
    console.info("Tickets Service Listening On Port", PORT);
  });
};

init();
