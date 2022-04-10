const express = require("express");
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const poolData = {
  UserPoolId: process.env.AWS_POOL_ID,
  ClientId: process.env.AWS_CLIENT_ID,
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
const validator = require('../middleware/aws_authourization')


router.get('/api/users/currentuser',validator.default(), (req: any, res: any) => {
  res.send({ currentUser: userPool.getCurrentUser() || null });
});

export { router as currentUserRouter };