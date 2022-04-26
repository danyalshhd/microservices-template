import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@dstransaction/common';
import { deleteAccountRouter } from './routes/delete';
import { newAccountRouter } from './routes/new';
import { showAccountsRouter } from './routes/show';
import { indexAccountRouter } from './routes';
import cookieParser from 'cookie-parser';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieParser());
app.use(
  cookieSession({
    signed: false,
    secure: true,
    name: 'session'
  })
);

app.use(currentUser);

app.use(deleteAccountRouter);
app.use(newAccountRouter);
app.use(showAccountsRouter);
app.use(indexAccountRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
