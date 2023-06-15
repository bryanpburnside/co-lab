import { Router } from 'express';
import { Pages, Story } from '../database/index.js';

const pagesRouter = Router();

pagesRouter.post('/', async (req, res) => {
  try {
    const { pageNumber, content, storyId } = req.body;

    //check for story
    const story = await Story.findByPk(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found-router' });
    }

    //create the page and save it to the database
    const page = await Pages.create({
      page_number: pageNumber,
      content,
      storyId,
    });

    res.status(201).json({ message: 'Page created successfully-router', page });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create the page-router' });
  }
});

export default pagesRouter;
