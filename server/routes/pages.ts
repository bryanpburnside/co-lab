import { Router } from 'express';
import { Pages, Story } from '../database/index.js';

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
    await page.save();
    res.status(201).json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create the page-router' });
  }
});

export default pagesRouter;
