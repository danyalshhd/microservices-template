import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { PortalUser } from '../../models/user-configuration/portalUser';
const router = express.Router();

router.post(
  '/api/product/user',
  [body('name').isString(), body('email').isString(), body('role').isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, email, role } = req.body;
    let existingUser = await PortalUser.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('User with this email already exists');
    }
    const user = PortalUser.build({
      name,
      email,
      role,
    });
    await user.save();
    res.status(201).send(user);
  }
);

router.get(
  '/api/product/user',
  [
    body('name').optional().isString(),
    body('email').optional().isString(),
    body('role').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { name, email, role } = req.body;
      let queryObj: any = {};
      name && (queryObj.name = name);
      email && (queryObj.email = email);
      role && (queryObj.role = role);
      let users = await PortalUser.find(queryObj);
      res.send(users);
    } catch (error) {
      throw new BadRequestError('Unable to retrieve Users.');
    }
  }
);

router.put(
  '/api/product/user',
  [
    body('id').isString(),
    body('name').optional().isString(),
    body('email').optional().isString(),
    body('role').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id, name, email, role } = req.body;
      let updateObj: any = {};
      name != null && (updateObj.name = name);
      email != null && (updateObj.email = email);
      role != null && (updateObj.role = role);
      const updatedUser = await PortalUser.findOneAndUpdate(
        { _id: id },
        updateObj,
        {
          new: true,
        }
      );
      if (!updatedUser) {
        throw new Error();
      }
      res.send(updatedUser);
    } catch (error) {
      throw new BadRequestError('Unable to update User.');
    }
  }
);

router.delete(
  '/api/product/user',
  body('id').isString(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const deletedUser = await PortalUser.findOneAndDelete({ _id: id });
      if (!deletedUser) {
        throw new Error();
      }
      res.send(deletedUser);
    } catch (error) {
      throw new BadRequestError('Unable to delete User.');
    }
  }
);

export { router as portalUserRouter };
