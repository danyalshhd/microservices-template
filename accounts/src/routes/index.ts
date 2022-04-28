import express, { Request, Response } from 'express';
import { requireAuth } from '@dstransaction/common';

const router = express.Router();
router.get('/api/accounts',
  //requireAuth,
  async (req: Request, res: Response) => {
    res.send({});
  });

export { router as indexAccountRouter };