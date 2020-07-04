import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { SubjectsEnum } from "./events/Subjects";

const clientId = randomBytes(4).toString("hex");
// docs call client stan (!?)
const stan = nats.connect("project_3_stubhub_clone", clientId, {
  url: "http://zubinmac.local:4222"
});

console.clear();

// no async-await. take event driven approach, so listen for event
stan.on("connect", () => {
  console.log(" *** publisher connected to NATS ***");
  const message = {
    id: "234534",
    title: "mock concert ticket",
    price: 20
  };

  stan.publish(SubjectsEnum.TicketCreated, JSON.stringify(message), () => {
    console.log("event published...");
  }); // stringify as NATS only accepts strings
});
