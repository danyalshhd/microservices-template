import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Bank } from '../../models/user-configuration/bank';
const router = express.Router();

router.post(
  '/api/product/bank',
  [body('banks').isArray()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { banks } = req.body;
      let bulkAdd = banks.map((obj: any) => {
        return {
          updateOne: {
            filter: { name: obj.name },
            update: { $set: { name: obj.name } },
            upsert: true,
          },
        };
      });
      const addBanks = await Bank.bulkWrite(bulkAdd);
      let addedBanks = addBanks.getUpsertedIds();
      console.log(addedBanks);
      if (addedBanks.length > 0) {
        addedBanks.forEach((bank: any) => {
          delete Object.assign(bank, { ['id']: bank['_id'] })['_id'];
          bank.name = banks[bank.index].name;
        });
      }
      console.log(addedBanks);
      res.status(201).send(addedBanks);
    } catch (error) {
      throw new BadRequestError('Unable to insert banks.');
    }
  }
);

router.get(
  '/api/product/bank',
  [body('name').optional().isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      let queryObj: any = {};
      name && (queryObj.name = name);
      let banks = await Bank.find(queryObj);
      res.send(banks);
    } catch (error) {
      throw new BadRequestError('Unable to retrieve Banks.');
    }
  }
);

router.put(
  '/api/product/bank',
  [body('id').isString(), body('name').isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id, name } = req.body;
      let updateObj: any = {};
      name != null && (updateObj.name = name);
      const updatedBank = await Bank.findOneAndUpdate({ _id: id }, updateObj, {
        new: true,
      });
      res.send(updatedBank);
    } catch (error) {
      throw new BadRequestError('Unable to update Bank.');
    }
  }
);

router.delete(
  '/api/product/bank',
  body('id').isString(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const deletedBank = await Bank.deleteOne({ _id: id });
      res.send(deletedBank);
    } catch (error) {
      throw new BadRequestError('Unable to delete Bank.');
    }
  }
);

export { router as bankRouter };

// const { name } = req.body;
// let existingBank = await Bank.findOne({ name });
// if (existingBank) {
//   throw new BadRequestError('Bank with this name is already present.');
// }
// const bank = Bank.build({ name });
// await bank.save();
// res.status(201).send(bank);
