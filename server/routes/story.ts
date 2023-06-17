import { Router } from 'express';
const CreateStoryRouter = Router();
import { Story } from '../database/index.js';


CreateStoryRouter.post('/', async (req, res) => {
  try {
    const { title, numberOfPages, coverImage } = req.body;
    // console.log(title);
    //create the story and retrieve the storyId
    const createdStory: any = await Story.create({
      title,
      coverImage,
      numberOfPages,
    });

    res.status(201).json(createdStory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create the story-Router' });
  }
});

CreateStoryRouter.get('/', async (req, res) => {
  try {
    //fetch all stories from the database
    const stories = await Story.findAll();
    res.status(200).json(stories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch stories-router' });
  }
});

export default CreateStoryRouter;