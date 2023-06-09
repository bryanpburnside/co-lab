import Express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const { PORT } = process.env;
import { sequelize, initialize } from './database/index.js';

const app = Express();

sequelize.authenticate()
  .then(() => console.info('Connected to the database'))
  .catch((err) => console.warn('Cannot connect to database:\n', err));

initialize();

app.listen(PORT, () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
})
