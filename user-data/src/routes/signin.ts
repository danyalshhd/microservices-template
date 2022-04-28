import express, { Request, Response } from 'express';
import { body } from 'express-validator';
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { poolData } = require('../config/cognito-config');
import { validateRequest, BadRequestError, convertToUtc } from '@dstransaction/common';
import { User } from '../models/user';

router.post(
  '/api/users/signin',
  [
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
      .withMessage('You must supply a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    if (req.cookies['idToken'])
    {
      res.send(`User Already Logged In.`)
      return;
    }
    let { phone_number, email, password } = req.body;
    let authenticationData = {
      Username: phone_number || email,
      Password: password,
    };
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    let userData = {
      Username: phone_number || email,
      Pool: userPool,
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: any) => {
        try {
          const date_n_time: any = new Date().toISOString();
          let timeinUTC = convertToUtc(date_n_time);
          User.updateOne({ _id: result.idToken.payload.sub },
            { $set: { lastLoginAttempt: timeinUTC } }, function (err: any, docs: any) {
            if (err){
                console.log("Error : ", err);
            }
            else{
                console.log("Result : ", docs);
            }
        });
       } catch (e) {
          console.log(e);
       }
        res.status(200).cookie("idToken", result.getIdToken().getJwtToken(), {
          httpOnly: true,
          sameSite: "strict",
        }).json({
          "message": "User signed in successfully "
        });
      },
      onFailure: (err: any) => {
        res.status(200).json({ "message": err.message });
      },
    });
  });


export { router as signinRouter };


// .cookie("refreshToken", result.getRefreshToken().getJwtToken(), {
//   httpOnly: true,
//   sameSite: "strict",
// })