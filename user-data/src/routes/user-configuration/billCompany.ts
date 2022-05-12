import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BillCompany } from '../../models/user-configuration/billCompany';
const router = express.Router();

router.post(
  '/api/product/billCompany',
  [
    body('companyName').isString(),
    body('paymentType').isString(),
    body('billCategory').isString(),
    body('billAccount').isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { companyName, paymentType, billCategory, billAccount } = req.body;
    let existingCompany = await BillCompany.findOne({
      companyName,
      billCategory,
    });
    if (existingCompany) {
      throw new BadRequestError(
        'Company with this companyName is already present.'
      );
    }
    const company = BillCompany.build({
      companyName,
      paymentType,
      billCategory,
      billAccount,
    });
    await company.save();
    await company.populate({ path: 'billCategory' });
    let response = { results: { message: 'SUCCESS', data: company } };
    res.status(201).send(response);
  }
);

router.get(
  '/api/product/billCompany',
  [
    body('companyName').optional().isString(),
    body('paymentType').optional().isString(),
    body('billCategory').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { companyName, paymentType, category } = req.body;
      let queryObj: any = {};
      companyName && (queryObj.companyName = companyName);
      paymentType && (queryObj.paymentType = paymentType);
      category && (queryObj.category = category);
      let companies = await BillCompany.find(queryObj).populate({
        path: 'billCategory',
      });
      let response = { results: { message: 'SUCCESS', dataItems: companies } };
      res.send(response);
    } catch (error) {
      throw new BadRequestError('Unable to retrieve Companies.');
    }
  }
);

router.put(
  '/api/product/billCompany',
  [
    body('id').isString(),
    body('companyName').optional().isString(),
    body('paymentType').optional().isString(),
    body('billCategory').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id, companyName, paymentType, billCategory } = req.body;
      let updateObj: any = {};
      companyName != null && (updateObj.companyName = companyName);
      paymentType != null && (updateObj.paymentType = paymentType);
      billCategory != null && (updateObj.billCategory = billCategory);
      const updatedCompany = await BillCompany.findOneAndUpdate(
        { _id: id },
        updateObj,
        {
          new: true,
        }
      ).populate({ path: 'billCategory' });
      if (!updatedCompany) {
        throw new Error();
      }
      let response = { results: { message: 'SUCCESS', data: updatedCompany } };
      res.send(response);
    } catch (error) {
      throw new BadRequestError('Unable to update Company.');
    }
  }
);

router.delete(
  '/api/product/billCompany',
  body('id').isString(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const deletedCompany = await BillCompany.deleteOne({ _id: id });
      let response = { results: { message: 'SUCCESS', data: deletedCompany } };
      res.send(response);
    } catch (error) {
      throw new BadRequestError('Unable to delete Company.');
    }
  }
);

export { router as billCompanyRouter };
