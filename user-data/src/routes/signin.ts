const express = require("express");
const router = express.Router();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const poolData = {
  UserPoolId: "us-east-1_cBhmA75S1",
  ClientId: "1kffecgahvsb2cnmg00avkup6h",
};
const validityCheck = require('../middleware/validinfo.ts')
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


router.post("/api/users/signin",validityCheck, async (req, res) => {
  try {
    // console.log("login: ", req.body.email, req.body.password);
    const loginDetails = {
      Username: req.body.email,
      Password: req.body.password,
    };

    const authDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      loginDetails
    );

    const userDetails = {
      Username: req.body.email,
      Pool: userPool,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userDetails);
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: function (data) {
        var accessToken = data.getAccessToken().getJwtToken();
        // console.log(accessToken);
        console.log("Success");
        // res.cookie("data",data);
        //, {expires: new Date(Date.now() + 90000),}
        res.send(`Login Successful`).status(200);
      },
      onFailure: function (err) {
        console.log("Failed");
        res.send(err);
      },
    });
  } catch (error) {
    console.error(error);
  }
});


export { router as signinRouter };