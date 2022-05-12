import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body, query } from 'express-validator';
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
    let obj: any = {};
    parishName && (obj.parishName = parishName);
    if (towns) {
      towns.length > 0 && (obj.towns = towns);
    }
    const address = Parish.build(obj);
    await address.save();
    res.status(201).send({ results: { message: 'SUCCESS', data: address } });
  }
);

router.get(
  '/api/product/address',
  [query('parishName').optional().isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { parishName } = req.query;
      let queryObj: any = {};
      parishName && (queryObj.parishName = parishName);
      let addresses = await Parish.find(queryObj);
      res.send({ results: { message: 'SUCCESS', dataItems: addresses } });
    } catch (error) {
      throw new BadRequestError('Unable to get Parish and Towns');
    }
  }
);

router.put(
  '/api/product/address',
  [
    body('id').isString(),
    body('parishName').isString(),
    body('towns').isArray(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id, parishName, towns } = req.body;
      let newTowns = towns.map((town: any) => {
        return { _id: town.id, townName: town.townName };
      });
      let updated = await Parish.findByIdAndUpdate(
        { _id: id },
        { parishName, towns: newTowns },
        { new: true }
      );
      if (!updated) {
        throw new Error();
      }
      res.send(updated);
    } catch (error) {
      throw new BadRequestError('Unable to update Parishes.');
    }
  }
);

router.delete(
  '/api/product/address',
  [body('id').optional().isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const deleteParish = await Parish.findOneAndDelete({
        _id: id,
      });
      if (!deleteParish) {
        throw new Error();
      }
      res.send(deleteParish);
    } catch (error) {
      throw new BadRequestError('Unable to delete Parish');
    }
  }
);

export { router as addressRouter };
