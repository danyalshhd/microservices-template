import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@dstransaction/common";
import { Transaction } from "../models/transaction";

const router = express.Router();

router.put(
  "/api/transactions/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      throw new NotFoundError();
    }

    if (transaction.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    transaction.set({
      title: req.body.title,
      price: req.body.price,
    });
    await transaction.save();

    res.send(transaction);
  }
);

export { router as updateTransactionRouter };
