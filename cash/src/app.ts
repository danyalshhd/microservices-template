import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@dstransaction/common';
import { requestMoneyRouter } from './routes/cashIn/requestMoney';
import { requestResponseRouter } from './routes/cashIn/requestResponse';
import { cashInAgentRequestRouter } from './routes/cashIn/agentRequest';
import { cashInAgentResponse } from './routes/cashIn/agentResponse';
import { cashOutAgentRequestRouter } from './routes/cashOut/agentRequest';
import { cashOutAgentResponse } from './routes/cashOut/agentResponse';
import { showAgentsRouter } from './routes/showAgents';
import { availableFriendsRouter } from './routes/friends/availableFriends';
import { deleteFriendRouter } from './routes/friends/deleteFriend';

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
app.use(requestMoneyRouter)
app.use(requestResponseRouter)
app.use(cashInAgentRequestRouter)
app.use(cashInAgentResponse)
app.use(cashOutAgentRequestRouter)
app.use(cashOutAgentResponse)
app.use(showAgentsRouter)
app.use(availableFriendsRouter)
app.use(deleteFriendRouter)
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
