import express, { Request, Response } from 'express';
const router = express.Router();
import { body } from 'express-validator';
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { poolData } = require('../config/cognito-config');
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
import { validateRequest, BadRequestError, currentUser } from '@dstransaction/common';

router.post("/api/users/forgotpassword", [
  body('phoneNumber')
    .optional({nullable: true})
    .isMobilePhone('any', { strictMode: true })
    .withMessage('Please provide a valid phone number'),
  body('email')
    .optional({nullable: true})
    .isEmail()
    .withMessage('Email must be valid'),
], validateRequest,
    async (req: Request, res: Response) => {
        let { phoneNumber, email } = req.body;
        const userData = {
            Username: phoneNumber || email,
            Pool: userPool,
        };
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.forgotPassword({
            onSuccess: (result: any) => {
                res.status(200).send('Success');
            },
            onFailure: (err: any) => {
                res.send(err);
            }

        })

    })

router.post("/api/users/newpassword", currentUser, [
    // body('phoneNumber')
    //     .isMobilePhone('any', { strictMode: true })
    //     .withMessage('Please provide a valid phone number'),
    body('newPassword')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
], validateRequest,
    async (req: Request, res: Response) => {
        let { phoneNumber, email, code, newPassword } = req.body;
        const userData = {
            Username: phoneNumber || email,
            Pool: userPool,
        };
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.confirmPassword(code, newPassword, {
            onSuccess: (result: any) => {
                if (req.currentUser !== null) {
                    res.clearCookie("idToken").status(200).json({ "message": "Password changed" });
                }
                else {
                    res.status(200).json({ "message": "Password changed" });
                }
            },
            onFailure: (err: any) => {
                throw new BadRequestError(err.message);
            }
        })
    })


export { router as forgotpasswordRouter };