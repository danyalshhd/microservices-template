import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Amount } from '../../models/user-configuration/amount';
const router = express.Router();

router.post(
  '/api/product/amount',
  [body('amounts').isArray()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { amounts } = req.body;
      let bulkAdd = amounts.map((obj: any) => {
        return {
          updateOne: {
            filter: { amount: obj.amount },
            update: { $set: { amount: obj.amount } },
            upsert: true,
          },
        };
      });
      const addAmounts = await Amount.bulkWrite(bulkAdd);
      let addedAmounts = addAmounts.getUpsertedIds();
      if (addedAmounts.length > 0) {
        addedAmounts.forEach((obj: any) => {
          delete Object.assign(obj, { ['id']: obj['_id'] })['_id'];
          obj.amount = amounts[obj.index].amount;
        });
      }
      res.status(201).send(addedAmounts);
    } catch (error) {
      throw new BadRequestError('Unable to insert amounts.');
    }
  }
);

router.get(
  '/api/product/amount',
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      let queryObj: any = {};
      let amounts = await Amount.find(queryObj);
      res.send(amounts);
    } catch (error) {
      throw new BadRequestError('Unable to retrieve Amounts.');
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
