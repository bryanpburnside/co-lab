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

app.get('/api/stories', async (req, res) => {
  try {
    const stories = await Story.findAll();
    res.status(200).json(stories);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: Could not get stories-server');
  }
});

app.post('/api/stories', async (req, res) => {
  try {
    const newStoryData = req.body;
    const newStory = await Story.create(newStoryData);
    res.status(201).json(newStory);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: Could not create story-server');
  }
});

// app.get('/api/pages', async (req, res) => {
//   try {
//     const storyId = req.query.storyId;
//     const pages = await Pages.find({ storyId });
//     res.json(pages);
//   } catch (error) {
//     console.error("Failed to fetch pages", error);
//     res.status(500).json({ error: 'Failed to fetch pages' });
//   }
// });

app.post('/api/pages', async (req, res) => {
  try {
    const newPage = req.body;
    const newSavePage = await Story.create(newPage);
    res.status(201).json(newPage);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: Could not create page-server');
  }
});


sequelize.authenticate()
  .then(() => console.info('Connected to the database'))
  .catch((err) => console.warn('Cannot connect to database:\n', err));

initialize();

app.listen(PORT, () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
})
