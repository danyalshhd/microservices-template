import express, { Request, Response } from 'express';
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { poolData } = require('../config/cognito-config');
import { User } from '../models/user';

router.post('/api/users/signup', (req: Request, res: Response) => {
  let { phone_number,email, password } = req.body;
  let attributeList: any = [];
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
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
export { router as signupRouter };
