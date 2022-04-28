import express, { Request, Response } from 'express';
const router = express.Router();
import { body } from 'express-validator';
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { poolData } = require('../config/cognito-config');
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
import { validateRequest, BadRequestError } from '@dstransaction/common';

router.post(
  '/api/users/forgotpassword',
  [
    body('phone_number')
      .isMobilePhone('any', { strictMode: true })
      .withMessage('Please provide a valid phone number'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let { phone_number } = req.body;
    const userData = {
      Username: phone_number,
      Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.forgotPassword({
      onSuccess: (result: any) => {
        res.send(
          `OTP has been sent to ${result.CodeDeliveryDetails.Destination}.`
        );
      },
      onFailure: (err: any) => {
        res.send(err);
      },
    });
  }
);

router.post(
  '/api/users/newpassword',
  [
    body('phone_number')
      .isMobilePhone('any', { strictMode: true })
      .withMessage('Please provide a valid phone number'),
    body('newPassword')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let { phone_number, code, newPassword } = req.body;
    const userData = {
      Username: phone_number,
      Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: (result: any) => {
        if (userPool.getCurrentUser() !== null) {
          res
            .clearCookie('idToken')
            .status(200)
            .json({ status: 1, message: 'Password changed' });
        } else {
          res.status(200).json({ status: 1, message: 'Password changed' });
        }
        // res.send(`Password for ${phone_number} has been reset successfully.`);
      },
      onFailure: (err: any) => {
        res.send(err);
      },
    });
  }
);

export { router as forgotpasswordRouter };
