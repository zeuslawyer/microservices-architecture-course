const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const app = express();
app.use(bodyParser.json());

const PORTS = {
  EVENT_BUS: 5005,
  POSTS: 5001,
  COMMENTS: 5002,
  COMMENT_MOD: 5003,
  QUERY: 5004,
};

app.post('/events', (req, res) => {
  const event = req.body; // the entire body will be the event object

  // emit events to all services
  axios.post(`http://localhost:${PORTS.POSTS}/events`, event); // post service
  axios.post(`http://localhost:${PORTS.COMMENTS}/events`, event); // comment service
  axios.post(`http://localhost:${PORTS.COMMENT_MOD}/events`, event); // comment moderation service
  axios.post(`http://localhost:${PORTS.QUERY}/events`, event); // query service

  console.log(`${new Date().toLocaleTimeString()} - EVENT EMITTED: `, event);
  res.send({ status: 'OK' });
});

app.listen(PORTS.EVENT_BUS, () => {
  console.info(`Event Bus listening on port ${PORTS.EVENT_BUS}!`);
});
