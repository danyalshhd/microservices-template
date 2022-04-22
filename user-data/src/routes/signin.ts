import express, { Request, Response } from 'express';
import { body } from 'express-validator';
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { poolData } = require('../config/cognito-config');
import { validateRequest, BadRequestError } from '@dstransaction/common';
import { User } from '../models/user';

router.post(
  '/api/users/signin',
  [
    body('phone_number')
      .isMobilePhone('any', { strictMode: true })
      .withMessage('Please provide a valid phone number'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let { phone_number, password } = req.body;
    let authenticationData = {
      Username: phone_number,
      Password: password,
    };
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    let userData = {
      Username: phone_number,
      Pool: userPool,
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    // const existingDevice = await User.findOne({ phone_number: phone_number,deviceID: 'u1' });
    // if (!existingDevice) {
    //   res.send('You are already signed in to another device.');
    // }
    // else
    // {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: any) => {
        res.status(200).cookie("idToken", result.getIdToken().getJwtToken(), {
          httpOnly: true,
          sameSite: "strict",
        }).json({
          "status": 1, "message": "user signed in successfully "
        });
      },
      onFailure: (err: any) => {
        res.status(200).json({ "status": 0, "message": "User sign in failed " + err });
      },
    });
    // }
  });


export { router as signinRouter };


