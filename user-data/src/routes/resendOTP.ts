import express, { Request, Response } from 'express';
import { body } from 'express-validator';
const router = express.Router();
const { poolData } = require('../config/cognito-config');
const AWS = require('aws-sdk');
import { validateRequest, BadRequestError } from '@dstransaction/common';


router.post('/api/users/resendotp', [
  body('phone_number')
    .optional({nullable: true})
    .isMobilePhone('any', { strictMode: true })
    .withMessage('Please provide a valid phone number'),
  body('email')
    .optional({nullable: true})
    .isEmail()
    .withMessage('Email must be valid'),
], validateRequest,
  async (req: Request, res: Response) => {
    let { phone_number, email } = req.body;
    let cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
    let params = {
      ClientId: poolData['ClientId'],
      Username: phone_number || email
    };
    cognitoIdentityServiceProvider.resendConfirmationCode(params, (err: any, result: any) => {
      if (err) {
        res.status(200).json({ "message": "OTP sent failed" });
      }
      else {
        res.status(200).json({ "message": "OTP sent successfully" });
      }
    });
  });

export { router as resendOTPRouter };