const express = require("express");
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const poolData = {
  UserPoolId: "us-east-1_cBhmA75S1",
  ClientId: "1kffecgahvsb2cnmg00avkup6h",
};
const validityCheck = require('../middleware/validinfo.ts')
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

router.post("/api/users/forgotpassword", async (req, res) => {
    let {email} = req.body;
    const userData = {
        Username: email,
        Pool: userPool,
      };
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData); 
      cognitoUser.forgotPassword({
          onSuccess: (result) => {
              res.send(`An email has been sent to ${result.CodeDeliveryDetails.Destination} with verification code.`);
          },
          onFailure: (err) => {
              res.send(err);
          }

      }) 

 })


 export { router as forgotpasswordRouter };