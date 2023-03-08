import express from 'express';
import dotenv from 'dotenv';
import { router } from './routes/api.js';

dotenv.config();

const app = express();

app.use(router);

const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
