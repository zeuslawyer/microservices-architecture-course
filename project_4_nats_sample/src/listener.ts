import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/TicketCreatedListener";

const clientId = randomBytes(4).toString("hex");
const stan = nats.connect("project_3_stubhub_clone", clientId, {
  url: "http://localhost:4222"
});

console.clear();

stan.on("connect", () => {
  console.log("*** listener now connected on NATS ***");

  // close event handler
  stan.on("close", () => {
    console.log("*** closting NATS connection....***");
    process.exit();
  });

  // set up listener
  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => {
  stan.close();
});
process.on("SIGTERM", () => {
  stan.close();
});
