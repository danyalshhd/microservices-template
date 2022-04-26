import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Agent } from '../../models/user-configuration/agent';
const router = express.Router();

router.post(
  '/api/product/agent',
  [
    body('agentId').isString(),
    body('agentName').isString(),
    body('location').isString(),
    body('bankId').isString(),
    body('rating').isNumeric(),
    body('latitude').isNumeric(),
    body('longitude').isNumeric(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      agentId,
      agentName,
      location,
      bankId,
      rating,
      latitude,
      longitude,
    } = req.body;
    let coordinates: any = { latitude, longitude };
    let existingAgent = await Agent.findOne({ agentId });
    if (existingAgent) {
      throw new BadRequestError('Agent with this ID already exists');
    }
    const agent = Agent.build({
      agentId,
      agentName,
      location,
      bankId,
      rating,
      coordinates,
    });
    await agent.save();
    res.status(201).send(agent);
  }
);

router.get(
  '/api/product/agent',
  [
    body('agentName').optional().isString(),
    body('agentId').optional().isString(),
    body('bankId').optional().isString(),
    body('rating').optional().isNumeric(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { agentName, agentId, bankId, rating } = req.body;
      let queryObj: any = {};
      agentName && (queryObj.agentName = agentName);
      agentId && (queryObj.agentId = agentId);
      bankId && (queryObj.bankId = bankId);
      rating && (queryObj.rating = rating);
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
    body('agentId').optional().isString(),
    body('agentName').optional().isString(),
    body('location').optional().isString(),
    body('bankId').optional().isString(),
    body('rating').optional().isNumeric(),
    body('latitude').optional().isNumeric(),
    body('longitude').optional().isNumeric(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const {
        id,
        agentId,
        agentName,
        location,
        bankId,
        rating,
        latitude,
        longitude,
      } = req.body;
      let coordinates: any = {};
      (latitude != null || latitude === 0) && (coordinates.latitude = latitude);
      (longitude != null || longitude === 0) &&
        (coordinates.longitude = longitude);
      console.log(coordinates);
      let updateObj: any = {};
      let coordinatesKeys: any = [];
      agentId != null && (updateObj.agentId = agentId);
      agentName != null && (updateObj.agentName = agentName);
      bankId != null && (updateObj.bankId = bankId);
      (rating != null || rating === 0) && (updateObj.rating = rating);
      location && (updateObj.location = location);
      coordinates && (coordinatesKeys = Object.keys(coordinates));
      coordinatesKeys.length > 0 && (updateObj.coordinates = {});
      if (coordinatesKeys.length > 0) {
        for (let i = 0; i < coordinatesKeys.length; i++) {
          (coordinates[coordinatesKeys[i]] != null ||
            coordinates[coordinatesKeys[i]] === 0) &&
            (updateObj.coordinates[coordinatesKeys[i]] =
              coordinates[coordinatesKeys[i]]);
        }
      }
      const updatedAgent = await Agent.findOneAndUpdate(
        { _id: id },
        convertToDotNotation(updateObj),
        { new: true }
      );
      if (!updatedAgent) {
        throw new Error();
      }
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

function convertToDotNotation(obj: any, newObj: any = {}, prefix = '') {
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      convertToDotNotation(obj[key], newObj, prefix + key + '.');
    } else {
      newObj[prefix + key] = obj[key];
    }
  }

  return newObj;
}

export { router as agentRouter };
