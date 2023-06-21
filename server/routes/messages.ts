import { Op } from 'sequelize';
import { Router } from 'express';
const Messages = Router();
import { Message } from '../database/index.js';

Messages.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log('user id', userId);
  try {
    const thread = await Message.findAll({ where: { [Op.or]: [{ senderId: userId }, { receiverId: userId }] } });
    if (thread) {
      res.status(200).send(thread);
    }
  } catch (err) {
    console.error('Failed to GET messages from db:', err);
    res.sendStatus(500);
  }
})

export default Messages;

