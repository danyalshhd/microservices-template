import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { FAQ } from '../../models/user-configuration/faq';
const router = express.Router();

router.post(
  '/api/product/faq',
  [body('question').isString(), body('answer').isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { question, answer } = req.body;
    let existingFAQ = await FAQ.findOne({ question });
    if (existingFAQ) {
      throw new BadRequestError('This FAQ already exists');
    }
    const faq = FAQ.build({ question, answer });
    await faq.save();
    res.status(201).send(faq);
  }
);

router.get(
  '/api/product/faq',
  [body('question').optional().isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { question } = req.body;
      let queryObj: any = {};
      question && (queryObj.question = question);
      let faqs = await FAQ.find(queryObj);
      res.send(faqs);
    } catch (error) {
      throw new BadRequestError('Unable to retrieve FAQS.');
    }
  }
);

router.put(
  '/api/product/faq',
  [
    body('id').isString(),
    body('question').optional().isString(),
    body('answer').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id, question, answer } = req.body;
      let updateObj: any = {};
      question != null && (updateObj.question = question);
      answer != null && (updateObj.answer = answer);
      const updatedFaq = await FAQ.findOneAndUpdate({ _id: id }, updateObj, {
        new: true,
      });
      if (!updatedFaq) {
        throw new Error();
      }
      res.send(updatedFaq);
    } catch (error) {
      throw new BadRequestError('Unable to update FAQ.');
    }
  }
);

router.delete(
  '/api/product/faq',
  body('id').isString(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const deletedFaq = await FAQ.findOneAndDelete({ _id: id });
      if (!deletedFaq) {
        throw new Error();
      }
      res.send(deletedFaq);
    } catch (error) {
      throw new BadRequestError('Unable to delete Faq.');
    }
  }
);

export { router as FAQRouter };
