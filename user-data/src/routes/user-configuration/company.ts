import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Company } from '../../models/user-configuration/company';
const router = express.Router();

router.post(
  '/api/product/company',
  [
    body('companyName').isString(),
    body('paymentType').isString(),
    body('category').isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { companyName, paymentType, category } = req.body;
    let existingCompany = await Company.findOne({
      companyName,
      paymentType,
      category,
    });
    if (existingCompany) {
      throw new BadRequestError(
        'Company with this companyName is already present.'
      );
    }
    const company = Company.build({ companyName, paymentType, category });
    await company.save();
    res.status(201).send(company);
  }
);

router.get(
  '/api/product/company',
  [
    body('companyName').optional().isString(),
    body('paymentType').optional().isString(),
    body('category').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { companyName, paymentType, category } = req.body;
      let queryObj: any = {};
      companyName && (queryObj.companyName = companyName);
      paymentType && (queryObj.paymentType = paymentType);
      category && (queryObj.category = category);
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
    body('paymentType').optional().isString(),
    body('category').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id, companyName, paymentType, category } = req.body;
      let updateObj: any = {};
      companyName != null && (updateObj.companyName = companyName);
      paymentType != null && (updateObj.paymentType = paymentType);
      category != null && (updateObj.category = category);
      const updatedCompany = await Company.findOneAndUpdate(
        { _id: id },
        updateObj,
        {
          new: true,
        }
      );
      if (!updatedCompany) {
        throw new Error();
      }
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
