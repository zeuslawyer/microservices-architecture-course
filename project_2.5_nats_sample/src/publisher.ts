import nats from "node-nats-streaming";
import { randomBytes } from "crypto";

import { TicketCreatedPublisher } from "./events/TicketCreatedPublisher";

const clientId = randomBytes(4).toString("hex");
// docs call client stan (!?)
const stan = nats.connect("tickets-natscluster", clientId, {
  url: "http://zubinmac.local:4222"
});

console.clear();

// no async-await. take event driven approach, so listen for event
stan.on("connect", async () => {
  console.log("*** NATS publisher connected");
});
