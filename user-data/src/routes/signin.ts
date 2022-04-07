import express, { Request, Response } from 'express';
import { body } from 'express-validator';
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const poolData = {
  UserPoolId: process.env.AWS_POOL_ID,
  ClientId: process.env.AWS_CLIENT_ID,
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
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
    const loginDetails = {
      Username: req.body.email,
      Password: req.body.password,
    };

    const authDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      loginDetails
    );

    const userDetails = {
      Username: req.body.email,
      Pool: userPool,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userDetails);
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (data: any) => {
        var accessToken = data.getAccessToken().getJwtToken();
        cognitoUser.setSignInUserSession(data);
        res.send(`Login Successful`).status(200);
      },
      onFailure: (err: any) => {
        throw new BadRequestError('Invalid credentials');
      },
    });
});


export { router as signinRouter };