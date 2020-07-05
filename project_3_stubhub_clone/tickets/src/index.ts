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
  if (!process.env.NATS_CLUSTER_ID) throw new Error(" MISSING ENV VAR NATS_CLUESTER_ID in TICKETS"); // defined in the -depl yaml
  if (!process.env.NATS_CLIENT_ID) throw new Error(" MISSING ENV VAR NATS_CLIENT_ID in TICKETS"); // defined in the -depl yaml
  if (!process.env.NATS_URL) throw new Error(" MISSING ENV VAR NATS_URL in TICKETS"); // defined in the -depl yaml

  try {
    // NATS server
    const clientId = process.env.NATS_CLIENT_ID; // unique for every nats client. Set in tickets-depl
    const clusterId = process.env.NATS_CLUSTER_ID; // taken from the nats-depl config -cid
    const url = process.env.NATS_URL;

    natsWrapper.connect(clusterId, clientId, url);

    // handle process exits
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    natsWrapper.client.on("close", () => {
      console.log("*** closting NATS connection....***");
      process.exit();
    });

    // mongoose
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
