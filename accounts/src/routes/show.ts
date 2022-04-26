import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@dstransaction/common';
import { Account } from '../models/account';

const router = express.Router();
router.get('/api/accounts/:accountId',
  //requireAuth,
  async (req: Request, res: Response) => {
    const account = await Account.findById(req.params.accountId).populate('transaction');

    if (!account) {
      throw new NotFoundError();
    }

    if (account.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(account);
  });

export { router as showAccountsRouter };