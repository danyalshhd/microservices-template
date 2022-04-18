import { AccountStatus, NotAuthorizedError, NotFoundError } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { AccountCancelledPublisher } from '../events/publishers/account-cancelled-publisher';
import { Account } from '../models/account';
import { Transaction } from '../models/transaction';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
router.delete('/api/accounts/:accountId', async (req: Request, res: Response) => {
  const { accountId } = req.params;

    const account = await Account.findById(accountId).populate('transaction');

    if (!account) {
      throw new NotFoundError();
    }
    if (account.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    account.status = AccountStatus.Cancelled;
    await account.save();

    // publishing an event saying this was cancelled!
    new AccountCancelledPublisher(natsWrapper.client).publish({
      id: account.id,
      version: account.version,
      transaction: {
        id: account.transaction.id,
      },
    });

    res.status(204).send(account);
});

export { router as deleteAccountRouter };