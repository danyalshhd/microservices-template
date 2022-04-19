import express, { Request, Response } from 'express';
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { poolData } = require('../config/cognito-config');
import { User } from '../models/user';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@dstransaction/common';

router.post('/api/users/signup',[
  body('phone_number')
    .isMobilePhone('any',{strictMode: true})
    .withMessage('Please provide a valid phone number'),
  body('email')
  .isEmail()
  .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
],validateRequest,
  async (req: Request, res: Response) => {
  let { phone_number,email, password } = req.body;
  let attributeList: any = [];
  let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "phone_number", Value: phone_number }));
  attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }));
  userPool.signUp(phone_number, password, attributeList, null, async (err: any, data: any) => {
    if (err) {
      console.log('Error: ',err);
      res.send(err);
    }
//     const user = User.build({
//   email, phone_number,
//   deviceID: ['u1'],
//   loginAttempt: 'checking'
// });
//     await user.save();
    res.send(`OTP sent to ${data.codeDeliveryDetails.Destination}`);
  });
});

router.post("/api/users/confirmation", async (req: Request, res: Response) => {
  try {
    let { phone_number, code } = req.body;
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username: phone_number,
      Pool: userPool,
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, function (err: any, result: any) {
      if (err) {
        console.error(err.message || JSON.stringify(err));
        res.send(err.message)
        return;
      }
      res.send(result);
    });
  } catch (error) {
    console.error(error);
    res.status(404);
  }
});

export { router as signupRouter };
