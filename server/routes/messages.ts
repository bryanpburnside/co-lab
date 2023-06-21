import { Op } from 'sequelize';
import { Router } from 'express';
const Messages = Router();
import { Message, User } from '../database/index.js';

Messages.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const thread = await Message.findAll({
      where: { [Op.or]: [{ senderId: userId }, { receiverId: userId }] },
      include: [
        { model: User, as: 'sender', attributes: ['name'] },
        { model: User, as: 'receiver', attributes: ['name'] },
      ],
      order: [['timestamp', 'ASC']]
    });
    if (thread) {
      res.status(200).send(thread);
    }
  } catch (err) {
    console.error('Failed to GET messages from db:', err);
    res.sendStatus(500);
  }
});

export default Messages;


// import { Op } from 'sequelize';
// import { Router } from 'express';
// const Messages = Router();
// import { Message } from '../database/index.js';

// Messages.get('/:userId', async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const thread = await Message.findAll({ where: { [Op.or]: [{ senderId: userId }, { receiverId: userId }] } });
//     if (thread) {
//       res.status(200).send(thread);
//     }
//   } catch (err) {
//     console.error('Failed to GET messages from db:', err);
//     res.sendStatus(500);
//   }
// })

// export default Messages;

