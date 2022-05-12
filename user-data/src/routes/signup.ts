import express, { Request, Response } from 'express';
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { poolData } = require('../config/cognito-config');
import { User } from '../models/user';
import { body } from 'express-validator';
import { validateRequest, BadRequestError, convertToUtc } from '@dstransaction/common';
import {Password} from '../services/password';

router.post('/api/users/signup', [
  body('phoneNumber')
    .optional({nullable: true})
    .isMobilePhone('any', { strictMode: true })
    .withMessage('Please provide a valid phone number'),
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
], validateRequest,
  async (req: Request, res: Response) => {
    let { firstName, lastName, email,dob, phoneNumber, password, mpin, secretQuestion, secretAnswer, biometric } = req.body;
    let attributeList: any = [];
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }));
    // attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "phone_number", Value: phoneNumber }));
    userPool.signUp(email || phoneNumber, password, attributeList, null, async (err: any, data: any) => {
      if (err) {
        console.log('Error: ', err);
        res.send(err);
        return;
      }
      else
      {
        const date_n_time: any = new Date().toISOString();
        const user = User.build({
          _id: data.userSub ,firstName, lastName,dob, email, phoneNumber, password: await Password.toHash(password), mpin: await Password.toHash(mpin), secretQuestion, secretAnswer, biometric
        });
        await user.save();
        res.status(201).send(`OTP sent to ${data.codeDeliveryDetails.Destination}`)
      }
      // ,lastLoginAttempt: convertToUtc(date_n_time)
    });
  });

router.post("/api/users/confirmation", async (req: Request, res: Response) => {
  try {
    let { phoneNumber, email, code } = req.body;
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username: phoneNumber || email,
      Pool: userPool,
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, function (err: any, result: any) {
      if (err) {
        console.error(err.message || JSON.stringify(err));
        res.send(err.message)
        return;
      }
      res.status(200).send(result);
    });
  } catch (error: any) {
    throw new BadRequestError(error.message);
  }
});

export { router as signupRouter };
