const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const poolData = {
  UserPoolId: "us-east-1_cBhmA75S1",
  ClientId: "1kffecgahvsb2cnmg00avkup6h",
};
// const cisp = new AWS.CognitoIdentityServiceProvider();

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

exports.authorizeUser = (req, res, next) => {
  let cognitoUser = userPool.getCurrentUser();
  if(cognitoUser!== null )
  {
    cognitoUser.getSession((err, session) => {
    if (err)
    {
      res.send(err);
    }
    if (session.isValid())
    {
      next();
    }
    else
    {
      res.send('Token Expired.')
      next();
    }
  })
 }
 else{
   res.status(401).send('User is not authenticated');
   next();
 }
};

exports.checkTokenExpiration = async (req, res, next) => {
  let cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
    let {rememberme} = req.body;
    if (req.path === "/api/users/signin" && rememberme === true)
    {
      await cognitoUser.getSession((err, session) => {
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
          cognitoUser.refreshSession(refresh_token, (err, session) => {
        if (err) {
          console.log(err);
        } else {
          AWS.config.credentials.params.Logins[
            'cognito-idp.us-east-1.amazonaws.com/us-east-1_cBhmA75S1'
          ] = session.getIdToken().getJwtToken();
          AWS.config.credentials.refresh(err => {
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
    else{
      res.status(401);
      }
    }

  next();
  }


  const getAWSCredentials = (credentials) => {
  return {
    accessKey: credentials.AccessKeyId,
    secretKey: credentials.SecretKey,
    sessionToken: credentials.SessionToken,
    region: 'us-east-1',
    invokeUrl: 'http://' + 'localhost:5000'
  };
};


// const AWS = require('aws-sdk');

// const cisp = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18'});

// exports.handler = (event, context, callback) => {
//      const accessToken = event.accessToken;
//      const cispParams = {
//          "AccessToken": accessToken
//      };

//      cisp.getUser(cispParams, (err, result) => {
//          if (err) {
//              console.log(err);
//              callback(err);
//          } else {
//              // code in this part is reached only if accessToken is valid.
//              // So add your code to respond to a verified user here.
//          }

// try {
//   let cognitoUser = userPool.getCurrentUser();
//   // let cognitoUserSession = userPool.
//   console.log(cognitoUser);
//   if (cognitoUser != null) 
//   {
//     cognitoUser.getSession(async (err, session) =>
//     {
//       if (err) {
//         console.error(err.message);
//         return;
//       }
//       if (session.isValid())
//       {
//         next();
//       }
//       else
//       {
//         res.send(`Session Expired.`)
//         next();
//       }
//       // AWS.config.credentials = new AWS.CognitoIdentityCredentials(
//       //   {
//       //     IdentityPoolId: 'us-east-1:27e324b7-2404-4c74-8ebc-b956a77f6fa5',
//       //     Logins: 
//       //     {
//       //       // Change the key below according to the specific region your user pool is in.
//       //       'cognito-idp.us-east-1.amazonaws.com/us-east-1_cBhmA75S1': session
//       //         .getIdToken()
//       //         .getJwtToken(),
//       //     },
//       //   }
//       //   );
//       //    await AWS.config.credentials.get ((err) => 
//       //   {
//       //       if (err) throw err;
//       //       session.identityId = AWS.config.credentials.identityId;
//       //       const credentials = AWS.config.credentials.data.Credentials;
//       //       console.log(credentials)
//       //       session.AWSCredentials = getAWSCredentials(credentials);
//       //   });
//     },
//     next())
//   }
//   else{
//     res.send(`Not Authorized`).status(401);
//   }
//   } 
// catch (err) {
//   console.error(err);
//   res.status(401);
//   next();
//   }