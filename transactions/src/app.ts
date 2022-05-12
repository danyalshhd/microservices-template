import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@dstransaction/common';
import { createTransactionRouter } from './routes/new';
import { showTransactionRouter } from './routes/show';
import { indexTransactionRouter } from './routes/index';
import { updateTransactionRouter } from './routes/update';

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

app.use(createTransactionRouter);
app.use(showTransactionRouter);
app.use(indexTransactionRouter);
app.use(updateTransactionRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };