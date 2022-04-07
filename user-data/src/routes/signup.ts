import express, { Request, Response } from 'express';
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const poolData = {
  UserPoolId: process.env.AWS_POOL_ID,
  ClientId: process.env.AWS_CLIENT_ID,
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
import { NotFoundError } from '@dstransaction/common';

router.post('/api/users/signup', (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;
    const emailData = {
      Name: "email",
      Value: email,
    };
    const emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(
      emailData
    );
    userPool.signUp(email, password, [emailAttribute], null, (err: any, data: any) => {
      if (err) {
        throw new NotFoundError ();
      }
      res.send(data);
    });
  } catch (error) {
    throw new NotFoundError ();
  }

});

export { router as signupRouter };
