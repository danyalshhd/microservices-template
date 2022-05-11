import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BillCategory } from '../../models/user-configuration/billCategory';
const router = express.Router();

router.post(
  '/api/product/billCategory',
  [body('categoryName').isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { categoryName } = req.body;
    let existingBillCategory = await BillCategory.findOne({ categoryName });
    if (existingBillCategory) {
      throw new BadRequestError('This Bill Category already exists');
    }
    const billCategory = BillCategory.build({ categoryName });
    await billCategory.save();
    let response = { results: { message: 'SUCCESS', data: billCategory } };
    res.status(201).send(response);
  }
);

router.get(
  '/api/product/billCategory',
  [body('categoryName').optional().isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { categoryName } = req.body;
      let queryObj: any = {};
      categoryName && (queryObj.categoryName = categoryName);
      let billCategories = await BillCategory.find(queryObj);
      let response = {
        results: { message: 'SUCCESS', dataItems: billCategories },
      };
      res.send(response);
    } catch (error) {
      throw new BadRequestError('Unable to retrieve Bill Categories.');
    }
  }
);

router.put(
  '/api/product/billCategory',
  [body('id').isString(), body('categoryName').optional().isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id, categoryName } = req.body;
      let updateObj: any = {};
      categoryName != null && (updateObj.categoryName = categoryName);
      const updatedBillCateogry = await BillCategory.findOneAndUpdate(
        { _id: id },
        updateObj,
        {
          new: true,
        }
      );
      if (!updatedBillCateogry) {
        throw new Error();
      }
      let response = {
        results: { message: 'SUCCESS', data: updatedBillCateogry },
      };
      res.send(response);
    } catch (error) {
      throw new BadRequestError('Unable to update Bill Category.');
    }
  }
);

router.delete(
  '/api/product/billCategory',
  body('id').isString(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const deletedBillCategory = await BillCategory.findOneAndDelete({
        _id: id,
      });
      if (!deletedBillCategory) {
        throw new Error();
      }
      let response = {
        results: { message: 'SUCCESS', data: deletedBillCategory },
      };
      res.send(response);
    } catch (error) {
      throw new BadRequestError('Unable to delete Bill Category.');
    }
  }
);

export { router as billCategoryRouter };
