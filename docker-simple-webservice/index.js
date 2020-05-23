const express = require('express');

const app = express();
const PORT = 8080;

app.get('/', (_, res) => {
  res.send('OK . Need to refresh the cache?');
});

app.listen(PORT, () => {
  console.info('Server listening on port', PORT);
});
