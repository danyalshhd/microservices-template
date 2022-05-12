const express = require("express");
const router = express.Router();
import { body } from 'express-validator';
import { validateRequest, BadRequestError, currentUser } from '@dstransaction/common';
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { poolData } = require('../config/cognito-config');


router.post("/api/users/changepassword", currentUser, [
  body('phone_number')
    .optional({nullable: true})
    .isMobilePhone('any', { strictMode: true })
    .withMessage('Please provide a valid phone number'),
  body('email')
    .optional({nullable: true})
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password'),
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('You must supply a new password')
], validateRequest,
  async (req: any, res: any) => {
    let { phone_number, email, password, newPassword } = req.body;
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: phone_number || email,
      Password: password,
    });
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    let userData = {
      Username: phone_number || email,
      Pool: userPool
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: any) => {
        cognitoUser.changePassword(password, newPassword, (err: any, result: any) => {
          if (err) {
            res.status(200).json({ "message": "Password Change Failed" });
          } else {
            if (req.currentUser !== null) {
              res.clearCookie("idToken").status(200).json({ "message": "Password changed" });
            }
            else {
              res.status(200).json({ "message": "Password changed" });
            }
          }
        });
      },
      onFailure: (err: any) => {
        res.status(200).json({ "message": "Failed to authenticate" });
      },
    });
  });

export { router as changePasswordRouter };