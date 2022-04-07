import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { forgotpasswordRouter } from './routes/forgotPassowrd';
import { errorHandler, NotFoundError } from '@dstransaction/common';
import {confirmationRouter} from './routes/confirmation';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
    name: 'session'
  })
);
// app.use((req, res, next) => {
//   console.log("333333333")
//   console.log(req.session);
//   console.log("333333333")
// })

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(forgotpasswordRouter);
app.use(confirmationRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    await mongoose.connect('mongodb://host.docker.internal:27017/auth'); 
    // mongodb://auth-mongo-srv:27017/auth
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }
  let port = 3000;
  app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
};

start();
