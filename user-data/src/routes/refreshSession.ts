import express, { Request, Response } from 'express';
import { currentUser } from '@dstransaction/common';
const { poolData } = require('../config/cognito-config');
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const CognitoRefreshToken = require('amazon-cognito-identity-js').CognitoRefreshToken;
const router = express.Router()

router.post('/api/users/refreshsession', currentUser,  (req: Request, res: Response) => {
    if (req.currentUser)
    {
      res.json("message: SESSION VALID")
    }
    else
    {
      let {phone_number, email} = req.body;
      let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      let userData = {
        Username: phone_number || email,
        Pool: userPool,
      };
      let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      let refreshToken = new CognitoRefreshToken({ RefreshToken: req.cookies['refreshToken'] })
      cognitoUser.refreshSession(refreshToken, (err: any, session: any) => {
          if (err)
          {
              res.json(err)
          }
          // console.log(session);
          res.cookie("idToken", session.getIdToken().getJwtToken(), {
              httpOnly: true,
              sameSite: "strict",
            }).json("message: Session Updated");
      } )
    }

})


export { router as refreshSession };