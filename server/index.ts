import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });
const { PORT } = process.env;
import { sequelize, initialize } from './database/index.js';
import Login from './routes/login.js';

const app = express();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

// MIDDLEWARE
app.use(express.json());
app.use(express.static(path.join(currentDirectory, '../dist')));

// ROUTES
app.use('/login', Login);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(currentDirectory, '../dist/index.html'), (err) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send(err);
//     }
//   });
// });

sequelize.authenticate()
  .then(() => console.info('Connected to the database'))
  .catch((err) => console.warn('Cannot connect to database:\n', err));

initialize();

app.listen(PORT, () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
})
