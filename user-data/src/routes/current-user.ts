const express = require("express");
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { poolData } = require('../config/cognito-config');
const validator = require('../middleware/aws_authourization')
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);



router.get('/api/users/currentuser',validator.default(), (req: any, res: any) => {
  res.send({ currentUser: userPool.getCurrentUser() || null });
});

export { router as currentUserRouter };