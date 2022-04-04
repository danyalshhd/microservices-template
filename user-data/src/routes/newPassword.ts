const express = require("express");
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const poolData = {
  UserPoolId: "us-east-1_cBhmA75S1",
  ClientId: "1kffecgahvsb2cnmg00avkup6h",
};
const validityCheck = require('../middleware/validinfo.ts')
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

router.post("/api/users/newpassword", async (req, res) => {
    let {email,code,newPassword} = req.body;
    const userData = {
        Username: email,
        Pool: userPool,
      };
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData); 
      cognitoUser.confirmPassword(code,newPassword,{
          onSuccess: (result) => {
              res.send(`Password for ${email} has been reset successfully.`);
          },
          onFailure: (err) => {
              res.send(err);
          }
      }) 
 })


 export { router as newpasswordRouter };