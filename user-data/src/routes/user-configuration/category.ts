import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Category } from '../../models/user-configuration/category';
const router = express.Router();

router.post(
  '/api/product/category',
  [
    body('name').isString(),
    body('visible').optional().isBoolean(),
    body('country').isAlpha(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, country, visible = true } = req.body;
    let existingCategory = await Category.findOne({ name, country });
    if (existingCategory) {
      throw new BadRequestError('Category with this name is already present.');
    }
    const category = Category.build({ name, country, visible });
    await category.save();
    res.status(201).send(category);
  }
);

router.post(
  '/api/product/bulkCategory',
  [body('categories').isArray()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { categories } = req.body;
      let bulkAdd = categories.map((obj: any) => {
        return {
          updateOne: {
            filter: { country: obj.country, name: obj.name },
            update: { $set: { country: obj.country, name: obj.name } },
            upsert: true,
          },
        };
      });
      const addCategories = await Category.bulkWrite(bulkAdd);
      let addedCategories = addCategories.getUpsertedIds();
      if (addedCategories.length > 0) {
        addedCategories.forEach((obj: any) => {
          delete Object.assign(obj, { ['id']: obj['_id'] })['_id'];
          obj.country = categories[obj.index].country;
          obj.name = categories[obj.index].name;
        });
        let response = {
          results: { message: 'SUCCESS', dataItems: addedCategories },
        };
        res.status(201).send(response);
      } else {
        let response = {
          results: { message: 'OK', dataItems: addedCategories },
        };
        res.status(200).send(response);
      }
    } catch (error) {
      throw new BadRequestError('Unable to insert bulk insert categories.');
    }
  }
);

router.get(
  '/api/product/category',
  [
    body('name').optional().isString(),
    body('visible').optional().isBoolean(),
    body('country').optional().isAlpha(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { name, country, visible } = req.body;
      let queryObj: any = {};
      name && (queryObj.name = name);
      country && (queryObj.country = country);
      visible && (queryObj.visible = visible);
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
    body('country').optional().isAlpha(),
    body('visible').optional().isBoolean(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id, name, country, visible } = req.body;
      let updateObj: any = {};
      name != null && (updateObj.name = name);
      visible != null && (updateObj.visible = visible);
      country != null && (updateObj.country = country);
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: id },
        updateObj,
        { new: true }
      );
      if (!updatedCategory) {
        throw new Error();
      }
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
      const deletedCategory = await Category.findOneAndDelete({ _id: id });
      if (!deletedCategory) {
        throw new Error();
      }
      res.send(deletedCategory);
    } catch (error) {
      throw new BadRequestError('Unable to delete Category.');
    }
  }
);

export { router as categoryRouter };
