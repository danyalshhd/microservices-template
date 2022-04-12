import express, { Request, Response } from "express";
import { Transaction } from "../models/transaction";
import logger from "../logger/logger";

const router = express.Router();

router.get("/api/transactions", async (req: Request, res: Response) => {
  logger.info("Working In Transaction Module");

  const transactions = await Transaction.find({});

  res.send(transactions);
});

export { router as indexTransactionRouter };
