import express, { Request, Response } from 'express';
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { poolData } = require('../config/cognito-config');
import { body } from 'express-validator';
import { validateRequest } from '@dstransaction/common';

router.post('/api/users/autoversignup', [
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
], validateRequest, (req: Request, res: Response) => {
    let {email, phone_number, password,} = req.body;
    let attributeList: any = [];
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "phone_number", Value: phone_number }));
    userPool.signUp(email || phone_number, password, attributeList, null, (err: any, data: any) => {
      if (err) {
        console.log('Error: ', err);
        res.send(err);
        return;
      }
      res.json("message: OK|SUCCESS");
    });
  });

export { router as autoversignupRouter };
