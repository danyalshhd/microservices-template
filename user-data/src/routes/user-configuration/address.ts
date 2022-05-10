import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Parish } from '../../models/user-configuration/parish';
import { Town } from '../../models/user-configuration/town';
const router = express.Router();

router.post(
  '/api/product/address',
  [body('parishName').isString(), body('towns').optional().isArray()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { parishName, towns } = req.body;
    let existingParish = await Parish.findOne({ parishName });
    if (existingParish) {
      throw new BadRequestError('Parish with this name is already present.');
    }
    const address = Parish.build({ parishName, towns });
    await address.save();
    res.status(201).send({ results: { message: 'SUCCESS', data: address } });
  }
);

router.get(
  '/api/product/address',
  [body('parishName').optional().isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { parishName } = req.body;
      let queryObj: any = {};
      parishName && (queryObj.parishName = parishName);
      let addresses = await Parish.find(queryObj);
      res.send({ results: { message: 'SUCCESS', dataItems: addresses } });
    } catch (error) {
      throw new BadRequestError('Unable to get Parish and Towns');
    }
  }
);

export { router as addressRouter };
