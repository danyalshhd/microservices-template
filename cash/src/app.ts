import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@dstransaction/common';
import { requestResponseRouter } from './routes/cashIn/friends/requestResponse';
import { cashOutAgentRequestRouter } from './routes/cashOut/agentRequest';
import { cashOutAgentResponse } from './routes/cashOut/agentResponse';
import { showAgentsRouter } from './routes/showAgents';
import { availableFriendsRouter } from './routes/friends/availableFriends';
import { deleteFriendRouter } from './routes/friends/deleteFriend';
import { cashInAgentTransactionRouter } from './routes/cashIn/agents/agentTransaction';
import { getcashInAgentTransactionRouter } from './routes/cashIn/agents/getAgentTransactions';
import { requestMoneyRouter } from './routes/cashIn/friends/requestMoney';
import { pendingRequestsRouter } from './routes/cashIn/friends/pendingRequests';
import { sentRequestsRouter } from './routes/cashIn/friends/allSentRequests';
import { receivedRequestsRouter } from './routes/cashIn/friends/allReceivedRequests';
import { getCashInAgentRequestRouter } from './routes/cashOut/getAgentRequests';

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
app.use(getcashInAgentTransactionRouter)
app.use(getCashInAgentRequestRouter);
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
