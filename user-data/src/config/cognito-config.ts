exports.poolData = {    
    UserPoolId : process.env.AWS_POOL_ID, // Your user pool id here    
    ClientId : process.env.AWS_CLIENT_ID // Your client id here
    }; 
exports.pool_region = process.env.AWS_REGION; //AWS region