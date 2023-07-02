import { Router } from 'express';
const Ear = Router();
import { Music } from '../database/index.js'; // Replace with the path to your model file



// POST route for adding data to the music table
Ear.post('/', async (req, res) => {
  try {
    const { songTitle, content, url } = req.body;

    // Create a new music record
    const newMusic: any = await Music.create({
      songTitle,
      content,
      url,
    });

    res.status(201).json(newMusic);
  } catch (error) {
    console.error('Error adding music:', error);
    res.status(500).json({ error: 'Failed to add music' });
  }
});

Ear.get('/', async (req, res) => {
  try {
    const mus = await Music.findAll();
    console.log('got music', mus);
    res.json(mus);
  } catch (err) {
    console.error('Couldnt get music:', err)
    res.sendStatus(500)
  }
});

export default Ear;




