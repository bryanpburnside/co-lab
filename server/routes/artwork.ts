import { Router } from 'express';
import { Artwork, User, VisualArt, Story, Sculpture, Music } from '../database/index.js';
const artworkRouter = Router();

artworkRouter.get('/byId/:artworkId', async (req, res) => {
  const { artworkId } = req.params;
  try {
    const artwork = await Artwork.findByPk(artworkId);
    if (artwork) {
      const { userId } = artwork.dataValues;
      const user = await User.findByPk(userId);
      res.send(user).status(200);
    }
  } catch (err) {
    console.error('Failed to GET all artwork', err);
    res.sendStatus(500);
  }
})

artworkRouter.delete('/byId/:artworkId', async (req, res) => {
  const { artworkId } = req.params;
  try {
    const artwork = await Artwork.findByPk(artworkId);
    if (artwork) {
      const art = await getArtByType(artwork.type, artwork.id);
      await artwork.destroy();
      await art.destroy();
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error('Failed to DELETE artwork:', err);
    res.sendStatus(500);
  }
})

artworkRouter.get('/byId/originalImage/:artworkId', async (req, res) => {
  const { artworkId } = req.params;
  try {
    const artwork = await Artwork.findByPk(artworkId);
    if (artwork) {
      const art = await getArtByType(artwork.type, artwork.id);
      if (art) {
        res.send(art.content).status(200);
      } else {
        res.sendStatus(404);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error('Failed to GET original image BY ARTWORK ID', err);
    res.sendStatus(500);
  }
});

artworkRouter.get('/byUserId/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const artwork = await Artwork.findAll({
      where: { userId },
      include: [VisualArt, Music, Story, Sculpture]
    });
    res.send(artwork).status(200);
  } catch (err) {
    console.error('Failed to GET artwork BY USER ID:', err);
  }
});

async function getArtByType(type: string, artworkId?: number) {
  let model: any;
  if (!artworkId) {
    console.log('No artwork ID provided');
  }
  switch (type) {
    case 'visual art':
      model = VisualArt;
      break;
    case 'sculpture':
      model = Sculpture;
      break;
    default:
      return null;
  }
  return model.findOne({ where: { artworkId } });
}

export default artworkRouter;