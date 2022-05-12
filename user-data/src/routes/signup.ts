import express, { Request, Response } from 'express';
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { poolData } = require('../config/cognito-config');
import { User } from '../models/user';
import { body } from 'express-validator';
import { validateRequest, BadRequestError, convertToUtc } from '@dstransaction/common';
import {Password} from '../services/password';

router.post('/api/users/signup', [
  body('phone_number')
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
    let { first_name, last_name, email,dob, phone_number, password, mpin, secret_question, secret_answer, biometric } = req.body;
    let attributeList: any = [];
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "phone_number", Value: phone_number }));
    userPool.signUp(email || phone_number, password, attributeList, null, async (err: any, data: any) => {
      if (err) {
        console.log('Error: ', err);
        res.send(err);
        return;
      }
      else
      {
        const date_n_time: any = new Date().toISOString();
        const user = User.build({
          _id: data.userSub ,first_name, last_name,dob, email, phone_number, password: await Password.toHash(password), mpin: await Password.toHash(mpin), secret_question, secret_answer, biometric
        });
        await user.save();
        res.status(201).send(`OTP sent to ${data.codeDeliveryDetails.Destination}`)
      }
      // ,lastLoginAttempt: convertToUtc(date_n_time)
    });
  });

router.post("/api/users/confirmation", async (req: Request, res: Response) => {
  try {
    let { phone_number, email, code } = req.body;
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username: phone_number || email,
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
