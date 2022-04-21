import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Company } from '../../models/user-configuration/company';
const router = express.Router();

router.post(
  '/api/product/company',
  [body('companyName').isString(), body('type').isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { companyName, type } = req.body;
    let existingCompany = await Company.findOne({ companyName, type });
    if (existingCompany) {
      throw new BadRequestError(
        'Company with this companyName is already present.'
      );
    }
    const company = Company.build({ companyName, type });
    await company.save();
    res.status(201).send(company);
  }
);

router.get(
  '/api/product/company',
  [
    body('companyName').optional().isString(),
    body('type').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { companyName, type } = req.body;
      let queryObj: any = {};
      companyName && (queryObj.companyName = companyName);
      type && (queryObj.type = type);
      let companies = await Company.find(queryObj);
      res.send(companies);
    } catch (error) {
      throw new BadRequestError('Unable to retrieve Companies.');
    }
  }
);

router.put(
  '/api/product/company',
  [
    body('id').isString(),
    body('companyName').optional().isString(),
    body('type').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id, companyName, type } = req.body;
      let updateObj: any = {};
      companyName != null && (updateObj.companyName = companyName);
      type != null && (updateObj.type = type);
      const updatedCompany = await Company.findOneAndUpdate(
        { _id: id },
        updateObj,
        {
          new: true,
        }
      );
      res.send(updatedCompany);
    } catch (error) {
      throw new BadRequestError('Unable to update Company.');
    }
  }
);

router.delete(
  '/api/product/company',
  body('id').isString(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const deletedCompany = await Company.deleteOne({ _id: id });
      res.send(deletedCompany);
    } catch (error) {
      throw new BadRequestError('Unable to delete Company.');
    }
  }
);

export { router as companyRouter };
