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

    //save the new story to the database
    await createdStory.save();
    res.status(201).json(createdStory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create the story-Router' });
  }
});

export default CreateStoryRouter;