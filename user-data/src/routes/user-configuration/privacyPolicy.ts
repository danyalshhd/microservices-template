import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { PrivacyPolicy } from '../../models/user-configuration/privacyPolicy';
const router = express.Router();

router.post(
  '/api/product/privacyPolicy',
  [body('policy').isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { policy } = req.body;
    let existingPolicy = await PrivacyPolicy.findOne({ policy });
    if (existingPolicy) {
      throw new BadRequestError('This policy already exists');
    }
    const privacyPolicy = PrivacyPolicy.build({ policy });
    await privacyPolicy.save();
    res.status(201).send(privacyPolicy);
  }
);

router.get(
  '/api/product/privacyPolicy',
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      let queryObj: any = {};
      let privacyPolicies = await PrivacyPolicy.findOne(queryObj);
      res.send(privacyPolicies);
    } catch (error) {
      throw new BadRequestError('Unable to retrieve policies.');
    }
  }
);

router.put(
  '/api/product/privacyPolicy',
  [body('policy').optional().isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { policy } = req.body;
      let filter: any = {};
      let updateObj: any = {};
      policy != null && (updateObj.policy = policy);
      const findPolicy = await PrivacyPolicy.findOne({});
      if (findPolicy) {
        filter._id = findPolicy.id;
      }
      const updatedPolicy = await PrivacyPolicy.findOneAndUpdate(
        filter,
        updateObj,
        {
          new: true,
          upsert: true,
        }
      );
      res.send(updatedPolicy);
    } catch (error) {
      throw new BadRequestError('Unable to update policy.');
    }
  }
);

router.delete(
  '/api/product/privacyPolicy',
  body('id').isString(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const deletedPolicy = await PrivacyPolicy.deleteOne({ _id: id });
      res.send(deletedPolicy);
    } catch (error) {
      throw new BadRequestError('Unable to delete policy.');
    }
  }
);

export { router as privacyPolicyRouter };
