const express = require("express");
const router = express.Router();
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@dstransaction/common';
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { poolData } = require('../config/cognito-config');


router.post("/api/users/changepassword",  [
  body('phone_number')
    .isMobilePhone('any',{strictMode: true})
    .withMessage('Please provide a valid phone number'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password'),
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('You must supply a new password')
],validateRequest,
   async (req: any, res: any) => {
    let {phone_number,password,newPassword} = req.body;
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
        cognitoUser.changePassword(password, newPassword, (err: any, result: any) => {
          if (err) {
            res.status(200).json({ "status": 0, "message": "Password Change Failed" });
          } else {
            if (userPool.getCurrentUser() !== null)
            {
              res.clearCookie("idToken").status(200).json({ "status": 1, "message": "Password changed" });
            }
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