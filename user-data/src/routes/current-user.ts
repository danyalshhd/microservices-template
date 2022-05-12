const express = require("express");
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { poolData } = require('../config/cognito-config');
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
import { currentUser, requireAuth } from '@dstransaction/common';


router.get('/api/users/currentuser',
  currentUser,
  requireAuth,
  (req: any, res: any) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };