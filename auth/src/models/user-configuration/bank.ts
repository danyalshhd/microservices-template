import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface BankAttrs {
  name: string;
}

// An interface that describes the properties
// that a User Model has
interface BankModel extends mongoose.Model<BankDoc> {
  build(attrs: BankAttrs): BankDoc;
}

// An interface that describes the properties
// that a User Document has
interface BankDoc extends mongoose.Document {
  name: string;
}

const BankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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

BankSchema.statics.build = (attrs: BankAttrs) => {
  return new Bank(attrs);
};

const Bank = mongoose.model<BankDoc, BankModel>('Bank', BankSchema);

export { Bank };
