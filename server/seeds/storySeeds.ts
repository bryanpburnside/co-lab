import { Story, Pages, Artwork } from '../database/index.js';


const createSeedData = async () => {
  try {

    const artwork = await Artwork.create({ type: 'book', userId: 'fakeId' });
    const { id: artworkId } = artwork.dataValues;

    //find if the story exists
    let story = await Story.findOne({ where: { title: 'Instructions' } });

    // If the story does not exist, create it
    if (!story) {
      story = await Story.create({
        artworkId,
        title: 'Instructions',
        coverImage: 'https://res.cloudinary.com/dhin8tgv1/image/upload/v1689102895/ifjlfroavjrpigqbzyrm.webp',
      });
      const pagesData = [
        {
          page_number: 1,
          content: 'Click on a page of your story to add content. The + above will add a new page and the speaker will read what is written on the page.',
          storyId: story.getDataValue('id'),
        },
        {
          page_number: 2,
          content: 'The page editor is designed to assist with writing a story. Click the microphone to use Speech-to-Text. Click the eraser to clear the page editor. Click the save icon to save the content to the page.',
          storyId: story.getDataValue('id'),
        },
        {
          page_number: 3,
          content: '',
          storyId: story.getDataValue('id'),
        },
      ];
      await Pages.bulkCreate(pagesData);
    }

    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error creating seed data:', error);
  }
};








export default createSeedData;