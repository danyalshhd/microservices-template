import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Parish } from '../../models/user-configuration/parish';
import { Town } from '../../models/user-configuration/town';
const router = express.Router();

// router.post(
//   '/api/product/address',
//   [body('parishName').isString(), body('towns').optional().isArray()],
//   validateRequest,
//   async (req: Request, res: Response) => {
//     const { parishName, towns } = req.body;
//     let existingParish = await Parish.findOne({ parishName });
//     if (existingParish) {
//       throw new BadRequestError('Parish with this name is already present.');
//     }
//     const address = Parish.build({ parishName });
//     await address.save();
//     res.status(201).send(address);
//   }
// );

export { router as addressRouter };
