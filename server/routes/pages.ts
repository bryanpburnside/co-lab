import { Router } from 'express';
import { Pages } from '../database/index.js';

const pagesRouter = Router();

pagesRouter.post('/', async (req, res) => {
  try {
    const { page_number, content, storyId } = req.body;

    //create the page and save it to the database
    const page: any = await Pages.create({
      page_number: page_number,
      content,
      storyId,
    });
    res.status(201).json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create the page-router' });
  }
});

pagesRouter.get('/', async (req, res) => {
  try {
    const storyId = req.query.storyId;
    const pages = await Pages.findAll({
      where: {
        storyId: storyId
      }
    });

    res.json(pages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch pages-router' });
  }
});

export default pagesRouter;
