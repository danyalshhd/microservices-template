import { TransactionStatus } from "@dstransaction/common";
import mongoose, { mongo } from "mongoose";

interface TransactionAttrs {
  title: string,
  price: number,
}

export interface TransactionDoc extends mongoose.Document {
  title: string,
  price: number,
  //isAlreadyPresent(): Promise<boolean>;
}

interface TransactionModel extends mongoose.Model<TransactionDoc> {
  build(attrs: TransactionAttrs): TransactionDoc;
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

transactionSchema.statics.build = (attrs: TransactionAttrs) => {
  return new Transaction(attrs);
}

// transactionSchema.methods.isAlreadyPresent = async function() {
// due to function keyword we get this as 'ticket' current context.
  //return !!ex;
// }

const Transaction = mongoose.model<TransactionDoc, TransactionModel>('Transaction', transactionSchema);

export { Transaction };
