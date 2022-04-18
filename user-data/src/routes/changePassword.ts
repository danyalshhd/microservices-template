const express = require("express");
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { poolData } = require('../config/cognito-config');


router.post("/api/users/changepassword", async (req: any, res: any) => {
    let {phone_number,password,newpassword} = req.body;
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: phone_number,
      Password: password,
    });
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    let userData = {
      Username: phone_number,
      Pool: userPool
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: any) => {
        cognitoUser.changePassword(password, newpassword, (err: any, result: any) => {
          if (err) {
            res.status(200).json({ "status": 0, "message": "Password Change Failed" });
          } else {
            res.status(200).json({ "status": 1, "message": "Password changed" });
          }
        });
      },
      onFailure: (err: any) => {
        res.status(200).json({ "status": 0, "message": "Failed to authenticate" });
      },
    });
});

export { router as changePasswordRouter };