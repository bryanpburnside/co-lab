import { Router } from 'express';
const Users = Router();
import { User } from '../database/index.js';

Users.post('/', async (req, res) => {
  const { id, name, email, picture } = req.body;
  try {
    const existingUser = await User.findByPk(id);
    if (existingUser) {
      console.log('User already exists');
      return;
    }
    const newUser = await User.create({ id, name, email, picture });
    if (newUser) {
      res.sendStatus(201);
    }
  } catch (err) {
    console.error('Failed to POST user to db at server:', err);
    res.sendStatus(500);
  }
})

export default Users;
