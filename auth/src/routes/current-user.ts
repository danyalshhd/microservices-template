const express = require("express");
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const poolData = {
  UserPoolId: "us-east-1_cBhmA75S1",
  ClientId: "1kffecgahvsb2cnmg00avkup6h",
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


router.get('/api/users/currentuser', (req, res) => {
  res.send({ currentUser: userPool.getCurrentUser() || null });
});

export { router as currentUserRouter };
