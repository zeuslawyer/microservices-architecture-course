import express, { Request } from 'express';
import bodyParser from 'body-parser';

const PORT = 3010;
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({});
});

app.get('/api/users/currentuser', (req: Request, res) => {
  res.send(`Auth service received GET request on the path ${req.path}`);
});

app.listen(PORT, () => {
  console.info('Auth Service Listening On Port', PORT);
});
