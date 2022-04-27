import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Bank } from '../../models/user-configuration/bank';
const router = express.Router();

router.post(
  '/api/product/bank',
  [
    body('bankName').isString(),
    body('bankCode').isString(),
    body('bankSwiftCode').isString(),
    body('institutionId').isString(),
    body('hintText').optional().isString(),
    body('accountMessageFormat').isString(),
    body('accountNumberLength').isNumeric(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      bankName,
      bankCode,
      bankSwiftCode,
      institutionId,
      hintText = '',
      accountMessageFormat,
      accountNumberLength,
    } = req.body;
    let existingBank = await Bank.findOne({ bankName });
    if (existingBank) {
      throw new BadRequestError('Bank with this Name already exists');
    }
    const bank = Bank.build({
      bankName,
      bankCode,
      bankSwiftCode,
      institutionId,
      hintText,
      accountMessageFormat,
      accountNumberLength,
    });
    await bank.save();
    res.status(201).send(bank);
  }
);

router.get(
  '/api/product/bank',
  [
    body('bankName').optional().isString(),
    body('bankCode').optional().isString(),
    body('bankSwiftCode').optional().isString(),
    body('institutionId').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { bankName, bankCode, bankSwiftCode, institutionId } = req.body;
      let queryObj: any = {};
      bankName && (queryObj.bankName = bankName);
      bankCode && (queryObj.bankCode = bankCode);
      bankSwiftCode && (queryObj.bankSwiftCode = bankSwiftCode);
      institutionId && (queryObj.institutionId = institutionId);
      let banks = await Bank.find(queryObj);
      res.send(banks);
    } catch (error) {
      throw new BadRequestError('Unable to retrieve Banks.');
    }
  }
);

router.put(
  '/api/product/bank',
  [
    body('id').isString(),
    body('bankName').optional().isString(),
    body('bankCode').optional().isString(),
    body('bankSwiftCode').optional().isString(),
    body('institutionId').optional().isString(),
    body('hintText').optional().isString(),
    body('accountMessageFormat').optional().isString(),
    body('accountNumberLength').optional().isNumeric(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const {
        id,
        bankName,
        bankCode,
        bankSwiftCode,
        institutionId,
        hintText,
        accountMessageFormat,
        accountNumberLength,
      } = req.body;
      let updateObj: any = {};
      bankName != null && (updateObj.bankName = bankName);
      bankCode != null && (updateObj.bankCode = bankCode);
      bankSwiftCode != null && (updateObj.bankSwiftCode = bankSwiftCode);
      institutionId != null && (updateObj.institutionId = institutionId);
      hintText != null && (updateObj.hintText = hintText);
      accountMessageFormat != null &&
        (updateObj.accountMessageFormat = accountMessageFormat);
      (accountNumberLength != null || accountNumberLength === 0) &&
        (updateObj.accountNumberLength = accountNumberLength);
      const updatedBank = await Bank.findOneAndUpdate({ _id: id }, updateObj, {
        new: true,
      });
      if (!updatedBank) {
        throw new Error();
      }
      res.send(updatedBank);
    } catch (error) {
      throw new BadRequestError('Unable to update Bank.');
    }
  }
);

router.delete(
  '/api/product/bank',
  body('id').isString(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const deletedBank = await Bank.findOneAndDelete({ _id: id });
      if (!deletedBank) {
        throw new Error();
      }
      res.send(deletedBank);
    } catch (error) {
      throw new BadRequestError('Unable to delete Bank.');
    }
  }
);

export { router as bankRouter };
