const express = require("express");
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const poolData = {
  UserPoolId: "us-east-1_cBhmA75S1",
  ClientId: "1kffecgahvsb2cnmg00avkup6h",
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

router.post('/api/users/signup', (req,res) => {
  try {
    let { email } = req.body;
    let { password } = req.body;
    const emailData = {
      Name: "email",
      Value: email,
    };
    const emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(
      emailData
    );
    userPool.signUp(email, password, [emailAttribute], null, (err, data) => {
      if (err) {
        console.error(err);
        res.status(404);
      }
      res.send(data);
    });
  } catch (error) {
    console.error(error);
  }

});

export { router as signupRouter };
