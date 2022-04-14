import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, TransactionStatus } from '@dstransaction/common';
import { Transaction } from '../models/transaction';
import { TransactionCreatedPublisher } from '../events/publishers/transaction-created-publisher';
import { NotificationCreatedPublisher } from '../events/publishers/notification-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/transactions',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    // Calculate an expiration date for this account
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const transaction = Transaction.build({
      title,
      price,
      status: TransactionStatus.Created,
      expiresAt: expiration,
      userId: req.currentUser!.id,
    });
    await transaction.save();
    
    await new TransactionCreatedPublisher(natsWrapper.client).publish({
      id: transaction.id,
      title: transaction.title,
      price: +transaction.price,
      status: TransactionStatus.Created,
      userId: transaction.userId,
      version: transaction.version,
      expiresAt: transaction.expiresAt.toISOString()
    });

    await new NotificationCreatedPublisher(natsWrapper.client).publish({
      id:transaction.userId,
      title:transaction.title,
      createdAt: new Date()
    })
    res.status(201).send(transaction);
  }
);

export { router as createTransactionRouter };
