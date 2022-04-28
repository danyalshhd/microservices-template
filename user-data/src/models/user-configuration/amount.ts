import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface AmountAttrs {
  amount: Number;
}

// An interface that describes the properties
// that a User Model has
interface AmountModel extends mongoose.Model<AmountDoc> {
  build(attrs: AmountAttrs): AmountDoc;
}

// An interface that describes the properties
// that a User Document has
interface AmountDoc extends mongoose.Document {
  amount: Number;
}

const AmountSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      unique: true,
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

AmountSchema.statics.build = (attrs: AmountAttrs) => {
  return new Amount(attrs);
};

const Amount = mongoose.model<AmountDoc, AmountModel>('Amount', AmountSchema);

export { Amount };
