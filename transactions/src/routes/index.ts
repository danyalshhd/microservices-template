import express from 'express';
import transactionsController from '../controllers/Transactions'
const router = express.Router();

router.get('/api/transactions', transactionsController);

export { router as indexTransactionRouter };
