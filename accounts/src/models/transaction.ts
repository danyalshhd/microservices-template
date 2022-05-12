import { AccountStatus } from "@dstransaction/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Account } from "./account";

interface TransactionAttrs {
  id: string;
  title: string,
  price: number,
}

export interface TransactionDoc extends mongoose.Document {
  title: string,
  price: number,
  version: number,
  isReserved(): Promise<boolean>;
}

interface TransactionModel extends mongoose.Model<TransactionDoc> {
  build(attrs: TransactionAttrs): TransactionDoc;
  findByEvent(event: { id: string, version: number }): Promise<TransactionDoc | null>;
}

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
})

transactionSchema.set('versionKey', 'version');
transactionSchema.plugin(updateIfCurrentPlugin);

transactionSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Transaction.findOne({
    _id: event.id,
    version: event.version - 1
  })
}

transactionSchema.statics.build = (attrs: TransactionAttrs) => {
  return new Transaction({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  })
}

transactionSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Account.findOne({
    ticket: this as any,
    status: {
      $in: [
        AccountStatus.Created,
        AccountStatus.AwaitingPayment,
        AccountStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Transaction = mongoose.model<TransactionDoc, TransactionModel>('Transaction', transactionSchema);

export { Transaction };
