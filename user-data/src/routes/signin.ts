import express, { Request, Response } from 'express';
import { body } from 'express-validator';
const moment = require('moment');
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { poolData } = require('../config/cognito-config');
import { validateRequest, BadRequestError } from '@dstransaction/common';

router.post(
  '/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    var body = req.body;
    var authenticationData = {
      Username: body['email'],
      Password: body['password'],
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
    );
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: body['email'],
        Pool: userPool,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result: any) => {
            res.status(200).json({
              "status": 1, "message": "user signed in successfully ", "data": {
                  "idToken": result.getIdToken().getJwtToken(),
                  "accessToken": result.getAccessToken().getJwtToken(),
                  "refreshToken": result.getRefreshToken().getToken()
              }
          });
        },
        onFailure: (err: any) => {
          res.status(200).json({ "status": 0, "message": "User sign in failed "+err });
        },
    });
});


export { router as signinRouter };


//Remember Me Code

// await cognitoUser.setDeviceStatusRemembered({
//   onSuccess: (data: any) => {
//     console.log(data);
//   },
//   onFailure: (err: any) => {
//     console.log(err);
//   }
// })