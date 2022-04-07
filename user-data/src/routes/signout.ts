import express, { Request, Response } from 'express';
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const poolData = {
  UserPoolId: process.env.AWS_POOL_ID,
  ClientId: process.env.AWS_CLIENT_ID,
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

router.get('/api/users/signout', (req: Request, res: Response) => {
  let cognitoUser = userPool.getCurrentUser();
  cognitoUser.signOut();
  res.send(`Signout Successfully`);
});

export { router as signoutRouter };
