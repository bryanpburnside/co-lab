import { Router } from 'express';
const VisualArtwork = Router();
import { VisualArt, Artwork } from '../database/index.js';

VisualArtwork.post('/', async (req, res) => {
  const { art, user } = req.body;
  try {
    // console.log(user, art);
    const artwork = await Artwork.create({ type: 'visual art' });
    const { id: artworkId } = artwork.dataValues;
    // console.log(artwork.dataValues.id);
    const newArt = await VisualArt.create({ artworkId, content: art });
    console.log('new art', newArt);
    res.sendStatus(201);
  } catch (err) {
    console.error('Failed to SAVE visual art to db:', err);
    res.sendStatus(500);
  }
})

export default VisualArtwork;
