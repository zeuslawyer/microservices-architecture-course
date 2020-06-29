import nats, { Stan } from "node-nats-streaming";

// docs call client stan (!?)
const client = nats.connect("project_3_stubhub_clone", "abc", {
  url: "http://localhost:4222"
});

// no async-await. take event driven approach, so listen for event
client.on("connect", () => {
  console.log(" *** publisher connected to NATS ***");
});
