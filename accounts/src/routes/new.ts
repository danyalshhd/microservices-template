import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { AccountStatus, BadRequestError, NotFoundError, requireAuth, validateRequest } from '@dstransaction/common';
import { body } from 'express-validator';
import { Transaction } from '../models/transaction';
import { Account } from '../models/account';
import { natsWrapper } from '../nats-wrapper';
import { AccountCreatedPublisher } from '../events/publishers/account-created-publisher';

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = express.Router();
router.post('/api/accounts',
  //requireAuth,
  [
    body('transactionId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TransactionId must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { transactionId } = req.body;

    // Find the transaction the user is trying to account in the database
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      throw new NotFoundError();
    }

    // Make sure that this transaction is not already reserved
    const isReserved = await transaction.isReserved();
    if (isReserved) {
      throw new BadRequestError('Transaction is already reserved');
    }

    // Calculate an expiration date for this account
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const account = Account.build({
      userId: req.currentUser!.id,
      status: AccountStatus.Created,
      expiresAt: expiration,
      transaction,
    });
    await account.save();

    // Publish an event saying that an account was created
    await new AccountCreatedPublisher(natsWrapper.client).publish({
      id: account.id,
      status: account.status,
      userId: account.userId,
      version: transaction.version,
      expiresAt: account.expiresAt.toISOString(),
      transaction: {
        id: transaction.id,
        price: transaction.price,
      }
    })

    res.status(201).send(account);
  });

export { router as newAccountRouter };
