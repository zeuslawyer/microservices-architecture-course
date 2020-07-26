import { natsWrapper } from "./nats-wrapper";

const init = async () => {
  // check env vars
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

    await natsWrapper.connect(clusterId, clientId, url);

    // handle process exits
    natsWrapper.client.on("close", () => {
      console.log("*** closing NATS connection....***");
      process.exit();
    });

    process.on("SIGINT", () => {
      console.log(" ##### SIGINT #### ");
      natsWrapper.client.close();
    });
    process.on("SIGTERM", () => {
      console.log(" ##### SIGTERM #### ");
      natsWrapper.client.close();
    });
  } catch (error) {
    console.error(
      "ORDER-EXPIRY SERVICE ERROR:   Failed to Connect to Database : ",
      error.message
    );
    throw error;
  }
};
init();
