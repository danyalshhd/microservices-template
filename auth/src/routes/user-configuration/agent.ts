import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Agent } from '../../models/user-configuration/agent';
const router = express.Router();

router.post(
  '/api/product/agent',
  [body('name').isString(), body('address').isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, address } = req.body;
    let existingAgent = await Agent.findOne({ name, address });
    if (existingAgent) {
      throw new BadRequestError('Agent already exists');
    }
    const agent = Agent.build({ name, address });
    await agent.save();
    res.status(201).send(agent);
  }
);

router.get(
  '/api/product/agent',
  [body('name').optional().isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      let queryObj: any = {};
      name && (queryObj.name = name);
      let agents = await Agent.find(queryObj);
      res.send(agents);
    } catch (error) {
      throw new BadRequestError('Unable to retrieve Agents.');
    }
  }
);

router.put(
  '/api/product/agent',
  [
    body('id').isString(),
    body('name').optional().isString(),
    body('address').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id, name, address } = req.body;
      let updateObj: any = {};
      name && (updateObj.name = name);
      address != null && (updateObj.address = address);
      const updatedAgent = await Agent.findOneAndUpdate(
        { _id: id },
        updateObj,
        { new: true }
      );
      res.send(updatedAgent);
    } catch (error) {
      throw new BadRequestError('Unable to update Agent.');
    }
  }
);

router.delete(
  '/api/product/agent',
  body('id').isString(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const deletedAgent = await Agent.findOneAndDelete({ _id: id });
      if (!deletedAgent) {
        throw new Error();
      }
      res.send(deletedAgent);
    } catch (error) {
      throw new BadRequestError('Unable to delete Agent.');
    }
  }
);

export { router as agentRouter };
