import express, { Request, Response } from 'express';
<<<<<<< HEAD
import { Notification } from '../models/notification'; 
=======
import { Notification } from '../models/notification';
>>>>>>> 324282cfe58ecca331acee4d034656e641fd3275

const router = express.Router();

router.get('/api/notifications', async (req: Request, res: Response) => {
  const notifications = await Notification.find({});

  res.send(notifications);
});

export { router as indexNotificationRouter };
