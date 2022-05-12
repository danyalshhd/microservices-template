import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body, query } from 'express-validator';
import { Agent } from '../../models/user-configuration/agent';
const router = express.Router();

router.post(
  '/api/product/agent',
  [
    body('agentId').isString(),
    body('agentName').isString(),
    body('parish').isString(),
    body('town').isString(),
    body('fullAddress').optional().isString(),
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
      parish,
      town,
      fullAddress,
      bankId,
      rating,
      latitude,
      longitude,
    } = req.body;
    let coordinates: any = { latitude, longitude };
    let address: any = { parish, town, fullAddress };
    let existingAgent = await Agent.findOne({ agentId });
    if (existingAgent) {
      throw new BadRequestError('Agent with this ID already exists');
    }
    const agent = Agent.build({
      agentId,
      agentName,
      address,
      bankId,
      rating,
      coordinates,
    });
    await agent.save();
    res.status(201).send(agent);
  }
);

router.post(
  '/api/product/bulkAgents',
  [body('agents').isArray()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { agents } = req.body;
      let bulkAdd = agents.map((obj: any) => {
        const {
          agentId,
          agentName,
          parish,
          town,
          fullAddress,
          bankId,
          rating,
          latitude,
          longitude,
        } = obj;
        let coordinates: any = { latitude, longitude };
        let address: any = { parish, town, fullAddress };
        let updateObj = {
          agentId,
          agentName,
          address,
          bankId,
          rating,
          coordinates,
        };
        return {
          updateOne: {
            filter: { agentId: obj.agentId },
            update: {
              $set: updateObj,
            },
            upsert: true,
          },
        };
      });
      const addAgent = await Agent.bulkWrite(bulkAdd);
      let addedAgents = addAgent.getUpsertedIds();
      if (addedAgents.length > 0) {
        addedAgents.forEach((obj: any) => {
          delete Object.assign(obj, { ['id']: obj['_id'] })['_id'];
          obj.agentId = agents[obj.index].agentId;
          obj.agentName = agents[obj.index].agentName;
          let address = {
            parish: agents[obj.index].parish,
            town: agents[obj.index].town,
            fullAddress: agents[obj.index].fullAddress,
          };
          obj.address = address;
          obj.bankId = agents[obj.index].bankId;
          obj.rating = agents[obj.index].rating;
          let coordinates = {
            latitude: agents[obj.index].latitude,
            longitude: agents[obj.index].longitude,
          };
          obj.coordinates = coordinates;
        });
        let response = {
          results: { message: 'SUCCESS', dataItems: addedAgents },
        };
        res.status(201).send(response);
      } else {
        let response = {
          results: { message: 'OK', dataItems: addedAgents },
        };
        res.status(200).send(response);
      }
    } catch (error) {
      throw new BadRequestError('Unable to insert bulk insert agents.');
    }
  }
);

router.get(
  '/api/product/agent',
  [
    query('agentName').optional().isString(),
    query('agentId').optional().isString(),
    query('bankId').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { agentName, agentId, bankId, parish, town } = req.query;
      let queryObj: any = {};
      let address: any = {};
      agentName && (queryObj.agentName = agentName);
      agentId && (queryObj.agentId = agentId);
      bankId && (queryObj.bankId = bankId);
      parish && (address.parish = parish);
      town && (address.town = town);
      Object.keys(address).length > 0 && (queryObj.address = address);
      let agents = await Agent.find(convertToDotNotation(queryObj));
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
    body('parish').optional().isString(),
    body('town').optional().isString(),
    body('fullAddress').optional().isString(),
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
        parish,
        town,
        fullAddress,
        bankId,
        rating,
        latitude,
        longitude,
      } = req.body;
      let coordinates: any = {};
      let address: any = {};
      let updateObj: any = {};
      (latitude != null || latitude === 0) && (coordinates.latitude = latitude);
      (longitude != null || longitude === 0) &&
        (coordinates.longitude = longitude);
      (rating != null || rating === 0) && (updateObj.rating = rating);
      let coordinatesKeys: any = [];
      agentId != null && (updateObj.agentId = agentId);
      agentName != null && (updateObj.agentName = agentName);
      bankId != null && (updateObj.bankId = bankId);
      parish != null && (address.parish = parish);
      town != null && (address.town = town);
      fullAddress != null && (address.fullAddress = fullAddress);
      Object.keys(address).length > 0 && (updateObj.address = address);
      coordinatesKeys = Object.keys(coordinates);
      coordinatesKeys.length > 0 && (updateObj.coordinates = coordinates);
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
      console.log(error);
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
