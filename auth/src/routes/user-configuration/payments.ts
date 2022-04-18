import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Payment } from '../../models/user-configuration/payment';
const router = express.Router();

router.post(
  '/api/product/payment',
  [body('amounts').isArray(), body('visible').optional().isBoolean()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { amounts } = req.body;
      const payments = await Payment.insertMany(amounts);
      res.status(201).send(payments);
    } catch (error) {
      console.log(error);
      throw new BadRequestError('Unable to insert amounts.');
    }
  }
);

router.delete(
  '/api/product/payment',
  [body('amounts').isArray(), body('visible').optional().isBoolean()],
  async (req: Request, res: Response) => {
    try {
      const { amounts } = req.body;
      const deletePayments = await Payment.deleteMany({
        amount: { $in: amounts },
      });
      res.send(deletePayments);
    } catch (error) {
      console.log(error);
      throw new Error('Unable to delete payments');
    }
  }
);

export { router as paymentRouter };
