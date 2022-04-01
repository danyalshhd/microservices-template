const express = require("express");
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const poolData = {
  UserPoolId: "us-east-1_cBhmA75S1",
  ClientId: "1kffecgahvsb2cnmg00avkup6h",
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


router.post("/confirmation", async (req, res) => {
    try {
      let { email } = req.body;
      let { code } = req.body;
      const userData = {
        Username: email,
        Pool: userPool,
      };
      let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  
      cognitoUser.confirmRegistration(code, true, function (err, result) {
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