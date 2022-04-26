import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError } from '@dstransaction/common';
import { indexNotificationRouter } from './routes/index';
import { showNotificationRouter } from './routes/show';

const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(indexNotificationRouter)
app.use(showNotificationRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };