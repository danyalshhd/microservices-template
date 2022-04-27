import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import { natsWrapper } from './nats-wrapper';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { onfidoRouter } from './routes/onfido';
import { categoryRouter } from './routes/user-configuration/category';
import { amountRouter } from './routes/user-configuration/amount';
import { bankRouter } from './routes/user-configuration/bank';
import { privacyPolicyRouter } from './routes/user-configuration/privacyPolicy';
import { termConditionRouter } from './routes/user-configuration/termCondition';
import { secretQuestionRouter } from './routes/user-configuration/secretQuestion';
import { companyRouter } from './routes/user-configuration/company';
import { countryRouter } from './routes/user-configuration/country';
import { agentRouter } from './routes/user-configuration/agent';
import { editProfileRouter } from './routes/editProfile';
import { imageRouter } from './routes/upload-image';
import { forgotpasswordRouter } from './routes/forgotPassowrd';
import { errorHandler, NotFoundError } from '@dstransaction/common';
import { resendOTPRouter } from './routes/resendOTP';
import { changePasswordRouter } from './routes/changePassword';
const cors = require('cors');

// const app = express();
// const corsOptions = {
//   origin: '*',
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

const app = express();
app.use(cors());
app.set('trust proxy', true);
app.use(json());
app.use(cookieParser());
app.use(
  cookieSession({
    signed: false,
    secure: true,
    name: 'session',
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(onfidoRouter);
app.use(imageRouter);
app.use(editProfileRouter);
app.use(amountRouter);
app.use(categoryRouter);
app.use(bankRouter);
app.use(privacyPolicyRouter);
app.use(termConditionRouter);
app.use(companyRouter);
app.use(secretQuestionRouter);
app.use(countryRouter);
app.use(agentRouter);
app.use(forgotpasswordRouter);
app.use(resendOTPRouter);
app.use(changePasswordRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINIT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect('mongodb://host.docker.internal:27017/digicel');
    // mongodb://auth-mongo-srv:27017/auth
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000.');
  });
};

start();
