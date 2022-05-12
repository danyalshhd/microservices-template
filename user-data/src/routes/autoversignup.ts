import express, { Request, Response } from 'express';
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { poolData } = require('../config/cognito-config');
import { body } from 'express-validator';
import { PortalUser } from '../models/user-configuration/portalUser';
import { validateRequest, BadRequestError } from '@dstransaction/common';


router.post('/api/users/autoversignup', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
], validateRequest, async (req: Request, res: Response) => {
    const {email, password,name} = req.body;
    let existingUser = await PortalUser.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('User with this email already exists');
    }
    let attributeList: any = [];
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }));
    userPool.signUp(email, password, attributeList, null, async(err: any, data: any) => {
      if (err) {
        console.log('Error: ', err);
        res.send(err);
        return;
      }
      const user = PortalUser.build({name, email});
      await user.save();
      res.json("message: OK|SUCCESS");
    });
  });

export { router as autoversignupRouter };


