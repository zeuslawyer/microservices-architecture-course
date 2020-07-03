import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const clientId = randomBytes(4).toString("hex");
const client = nats.connect("project_3_stubhub_clone", clientId, {
  url: "http://localhost:4222"
});

client.on("connect", () => {
  console.log("*** listener now connected on NATS ***");

  // close event handler
  client.on("close", () => {
    console.log("*** closting NATS connection....***");
    process.exit();
  });
  // set options, manual acknowledgement
  const options = client
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable() // fetch all unprocessed events
    .setDurableName("mock-listener-01"); // create a durable subscription

  // create topic subscription, add queue group, add options
  const subscription = client.subscribe("ticket:created", "orders-service-qGroup", options);

  // add subscription listener
  // documentation for Message type best accessed from type def file
  subscription.on("message", (msg: Message) => {
    console.log(`Message # ${msg.getSequence()} received by listener: `, msg.getData());

    // do something
    msg.ack(); // acknowledge
  });
});

process.on("SIGINT", () => {
  "interrupted.....";
  client.close();
});
process.on("SIGTERM", () => {
  "terminated...";
  client.close();
});
