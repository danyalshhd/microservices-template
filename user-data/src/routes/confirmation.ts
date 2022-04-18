const express = require("express");
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { poolData } = require('../config/cognito-config');
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


router.post("/api/users/confirmation", async (req: any, res: any) => {
  try {
    let { email, code } = req.body;
    const userData = {
      Username: email,
      Pool: userPool,
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, function (err: any, result: any) {
      if (err) {
        console.error(err.message || JSON.stringify(err));
        return;
      }
      res.send(result);
    });
  } catch (error) {
    console.error(error);
    res.status(404);
  }
});

export { router as confirmationRouter };