// @ts-ignore
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });
const { PORT } = process.env;
import { sequelize, initialize, Story, Pages } from './database/index.js';
import Login from './routes/login.js';
import CreateStoryRouter from './routes/story.js';
import pagesRouter from './routes/pages.js';

const app = express();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const staticFilesPath = path.join(currentDirectory, '../dist');

// MIDDLEWARE
app.use(express.json());

// ROUTES
// app.use('/login', Login);
app.use('/api/stories', CreateStoryRouter);
app.use('/api/pages', pagesRouter);
app.use(express.static(staticFilesPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(staticFilesPath, 'index.html'), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });
});

sequelize.authenticate()
  .then(() => console.info('Connected to the database'))
  .catch((err) => console.warn('Cannot connect to database:\n', err));

initialize();

app.listen(PORT, () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
})
