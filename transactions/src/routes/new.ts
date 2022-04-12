import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@dstransaction/common';
import { Transaction } from '../models/transaction';
import { TransactionCreatedPublisher } from '../events/publishers/transaction-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

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

    const transaction = Transaction.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await transaction.save();
    
    await new TransactionCreatedPublisher(natsWrapper.client).publish({
      id: transaction.id,
      title: transaction.title,
      price: +transaction.price,
      userId: transaction.userId,
    });

    res.status(201).send(transaction);
  }
);

export { router as createTransactionRouter };