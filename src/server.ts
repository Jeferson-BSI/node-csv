import express, { json } from 'express';
import { router } from './routes';

const app = express();

app.use(router);

app.listen(3333, () =>
  console.log('Server running on port: http://localhost:3333'),
);
