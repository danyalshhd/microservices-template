import express, { Request, Response } from 'express';
import { body } from 'express-validator';
const router = express.Router();
const { poolData } = require('../config/cognito-config');
const AWS = require('aws-sdk');
import { validateRequest, BadRequestError } from '@dstransaction/common';


router.post('/api/users/resendotp', [
  body('phone_number')
    .isMobilePhone('any', { strictMode: true })
    .withMessage('Please provide a valid phone number'),
], validateRequest,
  async (req: Request, res: Response) => {
    let { phone_number } = req.body;
    let cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
    let params = {
      ClientId: poolData['ClientId'],
      Username: phone_number
    };
    cognitoIdentityServiceProvider.resendConfirmationCode(params, (err: any, result: any) => {
      if (err) {
        res.status(200).json({ "status": 0, "message": "OTP sent failed" });
      }
      else {
        res.status(200).json({ "status": 1, "message": "OTP send successfully" });
      }
    });
  });

export { router as resendOTPRouter };