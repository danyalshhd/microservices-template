import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface PaymentAttrs {
  amount: Number;
}

// An interface that describes the properties
// that a User Model has
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

// An interface that describes the properties
// that a User Document has
interface PaymentDoc extends mongoose.Document {
  amount: Number;
}

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };
