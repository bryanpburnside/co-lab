import { sequelize } from '../database/index.js';
import { User, Story, Artwork, VisualArt, Music, Sculpture, Message, Pages } from '../database/index.js';
import seedData from '../../database_snapshot.js';

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true });

    await User.bulkCreate(seedData.users);

    await Artwork.bulkCreate(seedData.artwork);

    await Story.bulkCreate(seedData.stories);

    await VisualArt.bulkCreate(seedData.visualart);

    await Music.bulkCreate(seedData.music);

    await Sculpture.bulkCreate(seedData.sculptures);

    await Message.bulkCreate(seedData.messages);

    await Pages.bulkCreate(seedData.pages);

    console.log('Database successfully seeded!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    sequelize.close();
  }
}

seedDatabase();