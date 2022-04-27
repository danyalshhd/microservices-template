import express, { Request, Response } from 'express';
import { Notification } from '../models/notification';

const router = express.Router();

router.get('/api/notifications', async (req: Request, res: Response) => {
  const notifications = await Notification.find({});

  res.send(notifications);
});

export { router as indexNotificationRouter };
