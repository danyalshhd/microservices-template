import express, { Request, Response } from "express";
import { NotFoundError } from "@dstransaction/common";
import { Transaction } from "../models/transaction";

const router = express.Router();

router.get("/api/transactions/:id", async (req: Request, res: Response) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    throw new NotFoundError();
  }

  res.send(transaction);
});

export { router as showTransactionRouter };
