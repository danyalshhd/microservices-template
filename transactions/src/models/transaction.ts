import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TransactionAttrs {
  title: string;
  price: number;
  status: string;
  userId: string;
  expiresAt: Date;
}

interface TransactionDoc extends mongoose.Document {
  title: string;
  price: number;
  status: string;
  userId: string;
  version: number;
  expiresAt: Date;
}

interface TransactionModel extends mongoose.Model<TransactionDoc> {
  build(attrs: TransactionAttrs): TransactionDoc;
}

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

transactionSchema.set('versionKey', 'version');
transactionSchema.plugin(updateIfCurrentPlugin);

transactionSchema.statics.build = (attrs: TransactionAttrs) => {
  return new Transaction(attrs);
};

const Transaction = mongoose.model<TransactionDoc, TransactionModel>('Transaction', transactionSchema);

export { Transaction };
