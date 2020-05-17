const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const app = express();
app.use(bodyParser.json());

const PORT = 5005;

app.post('/events', (req, res) => {
  const event = req.body; // the entire body will be the event object

  axios.post('http://localhost:5001/events', event); // post service
  axios.post('http://localhost:5002/events', event); // comment service
  // axios.post('http://localhost:5003/events', event);

  console.log('EVENT EMITTED: ', event);
  res.send({ status: 'OK' });
});

app.listen(PORT, () => {
  console.info(`Event Bus listening on port ${PORT}!`);
});
