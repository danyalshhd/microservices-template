import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Category } from '../../models/user-configuration/category';
const router = express.Router();

router.post(
  '/api/product/category',
  [body('name').isString(), body('visible').optional().isBoolean()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, visible = true } = req.body;
    let existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw new BadRequestError('Category with this name is already present.');
    }
    const category = Category.build({ name, visible });
    await category.save();
    res.status(201).send(category);
  }
);

router.get(
  '/api/product/category',
  [body('name').optional().isString(), body('visible').optional().isBoolean()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { name, visible } = req.body;
      let queryObj: any = {};
      name != null && (queryObj.name = name);
      visible != null && (queryObj.visible = visible);
      let categories = await Category.find(queryObj);
      res.send(categories);
    } catch (error) {
      throw new BadRequestError('Unable to retrieve Categories.');
    }
  }
);

router.put(
  '/api/product/category',
  [
    body('id').isString(),
    body('name').optional().isString(),
    body('visible').optional().isBoolean(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id, name, visible } = req.body;
      let updateObj: any = {};
      name != null && (updateObj.name = name);
      visible != null && (updateObj.visible = visible);
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: id },
        updateObj,
        { new: true }
      );
      res.send(updatedCategory);
    } catch (error) {
      throw new BadRequestError('Unable to update Category.');
    }
  }
);

router.delete(
  '/api/product/category',
  body('id').isString(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const deletedCategory = await Category.deleteOne({ _id: id });
      res.send(deletedCategory);
    } catch (error) {
      throw new BadRequestError('Unable to delete Category.');
    }
  }
);

export { router as categoryRouter };
