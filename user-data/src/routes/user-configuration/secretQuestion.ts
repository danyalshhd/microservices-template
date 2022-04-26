import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { SecretQuestion } from '../../models/user-configuration/secretQuestion';
const router = express.Router();

router.post(
  '/api/product/secretQuestion',
  [body('question').isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { question } = req.body;
    let existingQuestion = await SecretQuestion.findOne({ question });
    if (existingQuestion) {
      throw new BadRequestError('This question already exists');
    }
    const secretQuestion = SecretQuestion.build({ question });
    await secretQuestion.save();
    res.status(201).send(secretQuestion);
  }
);

router.get(
  '/api/product/secretQuestion',
  [body('question').optional().isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { question } = req.body;
      let queryObj: any = {};
      question && (queryObj.question = question);
      let secretQuestions = await SecretQuestion.find(queryObj);
      res.send(secretQuestions);
    } catch (error) {
      throw new BadRequestError('Unable to retrieve Questions.');
    }
  }
);

router.put(
  '/api/product/secretQuestion',
  [body('id').isString(), body('question').optional().isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id, question } = req.body;
      let updateObj: any = {};
      question != null && (updateObj.question = question);
      const updatedQuestion = await SecretQuestion.findOneAndUpdate(
        { _id: id },
        updateObj,
        {
          new: true,
        }
      );
      if (!updatedQuestion) {
        throw new Error();
      }
      res.send(updatedQuestion);
    } catch (error) {
      throw new BadRequestError('Unable to update Question.');
    }
  }
);

router.delete(
  '/api/product/secretQuestion',
  body('id').isString(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const deletedQuestion = await SecretQuestion.deleteOne({ _id: id });
      res.send(deletedQuestion);
    } catch (error) {
      throw new BadRequestError('Unable to delete Question.');
    }
  }
);

export { router as secretQuestionRouter };
