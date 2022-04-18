import express, { Request, Response } from 'express';
const router = express.Router();
const { poolData } = require('../config/cognito-config');
const AWS = require('aws-sdk');


router.post('/api/users/resendotp', (req, res) => {
    var body = req.body;
    var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
    var params = {
      ClientId: poolData['ClientId'],
      Username: body['email']
    };
    cognitoIdentityServiceProvider.resendConfirmationCode(params, (err: any, result: any) => {
      if (err) {
        res.status(200).json({ "status": 0, "message": "OTP sent failed" });
      }
      else {
        res.status(200).json({ "status": 1, "message": "OTP send successfully"});
      }
    });
  });

  export { router as resendOTPRouter };