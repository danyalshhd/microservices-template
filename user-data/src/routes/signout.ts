import express, { Request, Response } from 'express';
const router = express.Router();
const { poolData } = require('../config/cognito-config');
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

router.get('/api/users/signout', (req: Request, res: Response) => {
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  res.clearCookie("idToken");
  let cognitoUser = userPool.getCurrentUser();
  cognitoUser.signOut();
  res.status(200).send(userPool.getCurrentUser());
});

export { router as signoutRouter };
