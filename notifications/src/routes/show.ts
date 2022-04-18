import express, { Request, Response } from 'express';
import { Notification } from '../models/notification';
import { NotFoundError } from '@dstransaction/common';

const router = express.Router();

router.get(
  '/api/notifications/:userId',
  async (req: Request, res: Response) => {
    const notifications = await Notification.find({
      userId: req.params.userId,
    });
    if (!notifications) {
      throw new NotFoundError();
    }
    res.send(notifications);
  }
);

export { router as showNotificationRouter };
