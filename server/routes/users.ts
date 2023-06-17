import { Router } from 'express';
const Users = Router();
import { User } from '../database/index.js';

Users.post('/', async (req, res) => {
  const { id, name, email, picture } = req.body;
  try {
    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      await User.create({ id, name, email, picture });
      res.sendStatus(201);
    }
  } catch (err) {
    console.error('Failed to CREATE user in db:', err);
    res.sendStatus(500);
  }
})

export default Users;
