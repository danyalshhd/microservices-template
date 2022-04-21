import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { TermCondition } from '../../models/user-configuration/termCondition';
const router = express.Router();

router.post(
  '/api/product/termCondition',
  [body('condition').isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { condition } = req.body;
    let existingCondition = await TermCondition.findOne({ condition });
    if (existingCondition) {
      throw new BadRequestError('This condition already exists');
    }
    const termCondition = TermCondition.build({ condition });
    await termCondition.save();
    res.status(201).send(termCondition);
  }
);

router.get(
  '/api/product/termCondition',
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { condition } = req.body;
      let queryObj: any = {};
      let termConditions = await TermCondition.findOne(queryObj);
      res.send(termConditions);
    } catch (error) {
      throw new BadRequestError('Unable to retrieve terms and conditions.');
    }
  }
);

router.put(
  '/api/product/termCondition',
  [body('condition').optional().isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { condition } = req.body;
      let updateObj: any = {};
      let filter: any = {};
      condition != null && (updateObj.condition = condition);
      const findCondition = await TermCondition.findOne({});
      if (findCondition) {
        filter._id = findCondition.id;
      }
      const updatedCondition = await TermCondition.findOneAndUpdate(
        filter,
        updateObj,
        {
          new: true,
          upsert: true,
        }
      );
      res.send(updatedCondition);
    } catch (error) {
      throw new BadRequestError('Unable to update condition.');
    }
  }
);

router.delete(
  '/api/product/termCondition',
  body('id').isString(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const deletedCondition = await TermCondition.deleteOne({ _id: id });
      res.send(deletedCondition);
    } catch (error) {
      throw new BadRequestError('Unable to delete terms and conditions.');
    }
  }
);

export { router as termConditionRouter };
