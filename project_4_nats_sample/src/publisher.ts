import nats from "node-nats-streaming";
import { randomBytes } from "crypto";

const clientId = randomBytes(4).toString("hex");
// docs call client stan (!?)
const client = nats.connect("project_3_stubhub_clone", clientId, {
  url: "http://zubinmac.local:4222"
});

// no async-await. take event driven approach, so listen for event
client.on("connect", () => {
  console.log(" *** publisher connected to NATS ***");
  const message = {
    id: "234534",
    title: "mock concert ticket",
    price: 20
  };

  // subject aka channel
  client.publish("ticket:created", JSON.stringify(message), () => {
    console.log("event published...");
  }); // stringify as NATS only accepts strings
});
