import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/TicketCreatedListener";
import { TicketUpdatedListener } from "./events/TicketUpdatedListener";

const clientId = randomBytes(4).toString("hex");
const stan = nats.connect("tickets-natscluster", clientId, {
  url: "http://localhost:4222"
});

console.clear();

stan.on("connect", () => {
  console.log("*** listener now connected on NATS ***");

  // close event handler
  stan.on("close", () => {
    console.log("*** ENDING NATS connection....***");
    process.exit();
  });

  // set up listener
  new TicketCreatedListener(stan).listen();
  new TicketUpdatedListener(stan).listen();
});

process.on("SIGINT", () => {
  stan.close();
});
process.on("SIGTERM", () => {
  stan.close();
});
