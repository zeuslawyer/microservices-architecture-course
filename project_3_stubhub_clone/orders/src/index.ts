import mongoose from "mongoose";
import { DatabaseConnectionError } from "@zeuscoder-public/microservices-course-shared";

import { natsWrapper } from "./nats-wrapper";
import { server } from "./server";
import { TicketCreatedListener } from "./Events/Listeners/TicketCreatedListener";
import { TicketUpdatedListener } from "./Events/Listeners/TicketUpdatedListener";

const PORT = 3000;

const init = async () => {
  // check env vars
  if (!process.env.JWT_KEY) throw new Error(" MISSING ENV VAR JWT_KEY "); // defined in the -depl yaml
  if (!process.env.MONGO_URI)
    throw new Error(" MISSING ENV VAR MONGO_URI in TICKETS"); // defined in the -depl yaml
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error(" MISSING ENV VAR NATS_CLUESTER_ID in TICKETS"); // defined in the -depl yaml
  if (!process.env.NATS_CLIENT_ID)
    throw new Error(" MISSING ENV VAR NATS_CLIENT_ID in TICKETS"); // defined in the -depl yaml
  if (!process.env.NATS_URL)
    throw new Error(" MISSING ENV VAR NATS_URL in TICKETS"); // defined in the -depl yaml

  try {
    // NATS server
    const clientId = process.env.NATS_CLIENT_ID; // unique for every nats client. Set in tickets-depl
    const clusterId = process.env.NATS_CLUSTER_ID; // taken from the nats-depl config -cid
    const url = process.env.NATS_URL;

    natsWrapper.connect(clusterId, clientId, url);

    // handle process exits
    natsWrapper.client.on("close", () => {
      console.log("*** closing NATS connection....***");
      process.exit();
    });

    process.on("SIGINT", () => {
      console.log(" ## SIGINT ## ");
      natsWrapper.client.close();
    });
    process.on("SIGTERM", () => {
      console.log(" #### SIGTERM #### ");
      natsWrapper.client.close();
    });

    // NATS listeners
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();

    console.log(" LOOK FOR NEXT LINE \n");
    new TicketCreatedListener(natsWrapper.client).getSubject();

    // mongoose
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  } catch (error) {
    console.error(
      "ORDERS ERROR:   Failed to Init the Orders Service. ",
      error.message,
      "\n ERROR : \n",
      error
    );
    throw new DatabaseConnectionError();
  }

  // server
  server.listen(PORT, () => {
    console.info("Orders Service Listening On Port", PORT);
  });
};

init();
