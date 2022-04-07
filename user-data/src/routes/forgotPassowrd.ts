import express, { Request, Response } from 'express';
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const poolData = {
    UserPoolId: process.env.AWS_POOL_ID,
    ClientId: process.env.AWS_CLIENT_ID,
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

router.post("/api/users/forgotpassword", async (req: Request, res: Response) => {
    let { email } = req.body;
    const userData = {
        Username: email,
        Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.forgotPassword({
        onSuccess: (result: any) => {
            res.send(`An email has been sent to ${result.CodeDeliveryDetails.Destination} with verification code.`);
        },
        onFailure: (err: any) => {
            res.send(err);
        }

    })

})

router.post("/api/users/newpassword", async (req: Request, res: Response) => {
    let { email, code, newPassword } = req.body;
    const userData = {
        Username: email,
        Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: (result: any) => {
            res.send(`Password for ${email} has been reset successfully.`);
        },
        onFailure: (err: any) => {
            res.send(err);
        }
    })
})


export { router as forgotpasswordRouter };