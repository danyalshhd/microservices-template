import mongoose  from 'mongoose';
import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth, validateRequest } from '@dstransaction/common';
import { body } from 'express-validator';
import { Transaction } from '../models/transaction';
import { Account } from '../models/account';

const router = express.Router();
router.post('/api/accounts', requireAuth, [
  body('transactionId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TransactionId must be provided')
],
validateRequest,
async (req: Request, res: Response) => {
  const { transactionId } = req.body;

  const transaction = await Transaction.findById(transactionId)
  if (!transaction) {
    throw new NotFoundError();
  }

  //const isAlreadyPresent = await transaction.isAlreadyPresent();

  res.send({});
});

export { router as newAccountRouter };
