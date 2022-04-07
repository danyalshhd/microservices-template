const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const poolData = {
  UserPoolId: process.env.AWS_POOL_ID,
  ClientId: process.env.AWS_CLIENT_ID,
};


const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

exports.authorizeUser = (req: any, res: any, next: any) => {
  let cognitoUser = userPool.getCurrentUser();
  if (cognitoUser !== null) {
    cognitoUser.getSession((err: any, session: any) => {
      if (err) {
        res.send(err);
      }
      if (session.isValid()) {
        next();
      }
      else {
        res.send('Token Expired.')
        next();
      }
    })
  }
  else {
    res.status(401).send('User is not authenticated');
    next();
  }
};

exports.checkTokenExpiration = async (req: any, res: any, next: any) => {
  let cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
    let { rememberme } = req.body;
    if (req.path === "/api/users/signin" && rememberme === true) {
      await cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          console.error(err.message);
          return;
        }
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'us-east-1:27e324b7-2404-4c74-8ebc-b956a77f6fa5', // your identity pool id here
          Logins: {
            // Change the key below according to the specific region your user pool is in.
            'cognito-idp.us-east-1.amazonaws.com/us-east-1_cBhmA75S1': session
              .getIdToken()
              .getJwtToken(),
          },
        });
        let refresh_token = session.getRefreshToken();
        // receive session from calling cognitoUser.getSession()
        AWS.config.region = 'us-east-1'
        if (AWS.config.credentials.needsRefresh()) {
          cognitoUser.refreshSession(refresh_token, (err: any, session: any) => {
            if (err) {
              console.log(err);
            } else {
              AWS.config.credentials.params.Logins[
                'cognito-idp.us-east-1.amazonaws.com/us-east-1_cBhmA75S1'
              ] = session.getIdToken().getJwtToken();
              AWS.config.credentials.refresh((err: any) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log('TOKEN SUCCESSFULLY UPDATED');
                }
              });
            }
          });
        }
      });
    }
    else {
      res.status(401);
    }
  }

  next();
}