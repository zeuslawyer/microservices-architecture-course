const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios").default;
const app = express();
app.use(bodyParser.json());

const PORTS = {
  EVENT_BUS: 5005,
  POSTS: 5001,
  COMMENTS: 5002,
  COMMENT_MOD: 5003,
  QUERY: 5004
};

// db
const events = []; // will behave like a stack

/* distributes all events to the various other services, for handling if necessary */
app.post("/events", (req, res) => {
  const event = req.body; // the entire body will be the event object
  events.push(event);

  // emit events to all services
  axios.post(`http://localhost:${PORTS.POSTS}/events`, event); // post service
  axios.post(`http://localhost:${PORTS.COMMENTS}/events`, event); // comment service
  axios.post(`http://localhost:${PORTS.COMMENT_MOD}/events`, event); // comment moderation service
  axios.post(`http://localhost:${PORTS.QUERY}/events`, event); // query service

  console.log(`${new Date().toLocaleTimeString()} - EVENT EMITTED: `, event.type);
  res.send({ status: "OK" });
});

/*  endpoint for services to retrieve all events passed through the event bus.
    needed where a service goes offline and then has to "catch up" and sync its db with events in the events bus
*/
app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(PORTS.EVENT_BUS, () => {
  console.info(`Event Bus listening on port ${PORTS.EVENT_BUS}!`);
});
