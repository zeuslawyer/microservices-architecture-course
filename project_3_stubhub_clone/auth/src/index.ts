import express from 'express';
import bodyParser from 'body-parser';

const PORT = 3010;
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({});
});

app.listen(PORT, () => {
  console.info('Auth Service Listening On Port ', PORT);
});
