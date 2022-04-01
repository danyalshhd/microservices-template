const express = require("express");
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const poolData = {
  UserPoolId: "us-east-1_cBhmA75S1",
  ClientId: "1kffecgahvsb2cnmg00avkup6h",
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

router.get('/api/users/signout', (req, res) => {
  let cognitoUser = userPool.getCurrentUser();
  cognitoUser.signOut();
  res.send(`Signout Successfully`);
});

export { router as signoutRouter };
