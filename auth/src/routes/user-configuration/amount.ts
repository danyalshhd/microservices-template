import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Amount } from '../../models/user-configuration/amount';
const router = express.Router();

router.post(
  '/api/product/amount',
  [body('amounts').isArray(), body('visible').optional().isBoolean()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { amounts } = req.body;
      const addAmounts = await Amount.insertMany(amounts);
      res.status(201).send(addAmounts);
    } catch (error) {
      console.log(error);
      throw new BadRequestError('Unable to insert amounts.');
    }
  }
);

router.delete(
  '/api/product/amount',
  [body('amounts').isArray()],
  async (req: Request, res: Response) => {
    try {
      const { amounts } = req.body;
      const deleteAmounts = await Amount.deleteMany({
        _id: { $in: amounts },
      });
      res.send(deleteAmounts);
    } catch (error) {
      console.log(error);
      throw new Error('Unable to delete amounts');
    }
  }
);

export { router as amountRouter };
