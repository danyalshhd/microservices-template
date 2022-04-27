import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@dstransaction/common';
import { requestMoneyRouter } from './routes/cashIn/requestMoney';
import { requestResponseRouter } from './routes/cashIn/requestResponse';
import { cashOutAgentRequestRouter } from './routes/cashOut/agentRequest';
import { cashOutAgentResponse } from './routes/cashOut/agentResponse';
import { showAgentsRouter } from './routes/showAgents';
import { availableFriendsRouter } from './routes/friends/availableFriends';
import { deleteFriendRouter } from './routes/friends/deleteFriend';
import { cashInAgentTransactionRouter } from './routes/cashIn/agentTransaction';
import { pendingRequestsRouter } from './routes/cashIn/pendingRequests';
import { sentRequestsRouter } from './routes/cashIn/allSentRequests';
import { receivedRequestsRouter } from './routes/cashIn/allReceivedRequests';

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
app.use(cashOutAgentRequestRouter)
app.use(cashOutAgentResponse)
app.use(showAgentsRouter)
app.use(availableFriendsRouter)
app.use(deleteFriendRouter)
app.use(cashInAgentTransactionRouter)
app.use(pendingRequestsRouter)
app.use(sentRequestsRouter)
app.use(receivedRequestsRouter)
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
