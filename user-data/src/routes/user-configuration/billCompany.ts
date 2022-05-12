import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body, query } from 'express-validator';
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
    query('companyName').optional().isString(),
    query('paymentType').optional().isString(),
    query('billCategory').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      console.log('the query body is ', req.query);
      const { companyName, paymentType, billCategory } = req.query;
      let queryObj: any = {};
      companyName && (queryObj.companyName = companyName);
      paymentType && (queryObj.paymentType = paymentType);
      billCategory && (queryObj.billCategory = billCategory);
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
    body('billAccount').optional().isString(),
    body('billCategory').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id, companyName, paymentType, billCategory, billAccount } =
        req.body;
      let updateObj: any = {};
      companyName != null && (updateObj.companyName = companyName);
      paymentType != null && (updateObj.paymentType = paymentType);
      billCategory != null && (updateObj.billCategory = billCategory);
      billAccount != null && (updateObj.billAccount = billAccount);
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
      const deletedCompany = await BillCompany.findOneAndDelete({ _id: id });
      if (!deletedCompany) {
        throw new Error();
      }
      let response = { results: { message: 'SUCCESS', data: deletedCompany } };
      res.send(response);
    } catch (error) {
      throw new BadRequestError('Unable to delete Company.');
    }
  }
);

export { router as billCompanyRouter };
