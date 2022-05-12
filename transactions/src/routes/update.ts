import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@dstransaction/common';
import { Transaction } from '../models/transaction';
import { TransactionUpdatedPublisher } from '../events/publishers/transaction-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/transactions/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      throw new NotFoundError();
    }

    if (transaction.accountId) {
      throw new BadRequestError('Cannot edit a reserved transaction');
    }

    if (transaction.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    transaction.set({
      title: req.body.title,
      price: req.body.price,
    });
    await transaction.save();

    new TransactionUpdatedPublisher(natsWrapper.client).publish({
      id: transaction.id,
      title: transaction.title,
      price: transaction.price,
      userId: transaction.userId,
      version: transaction.version,
    })

    res.send(transaction);
  }
);

export { router as updateTransactionRouter };
