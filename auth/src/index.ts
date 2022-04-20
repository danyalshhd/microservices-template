import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@dstransaction/common';

const app = express();
//app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
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

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
//   if (!process.env.JWT_KEY) {
//     throw new Error('JWT_KEY must be defined');
//   }

//   if (!process.env.MONGO_URI) {
//     throw new Error('MONGO_URI must be defined');
//   }

   try {
     await mongoose.connect('mongodb://172.31.52.200:27017/auth');
     console.log('Connected to MongoDb');
   } catch (err) {
     console.error(err);
   }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

start();
