import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface BankAttrs {
  bankName: string;
  bankCode: string;
  bankSwiftCode: string;
  institutionId: string;
  hintText?: string;
  accountMessageFormat: string;
  accountNumberLength: Number;
}

// An interface that describes the properties
// that a User Model has
interface BankModel extends mongoose.Model<BankDoc> {
  build(attrs: BankAttrs): BankDoc;
}

// An interface that describes the properties
// that a User Document has
interface BankDoc extends mongoose.Document {
  bankName: string;
  bankCode: string;
  bankSwiftCode: string;
  institutionId: string;
  hintText: string;
  accountMessageFormat: string;
  accountNumberLength: Number;
}

const BankSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
      required: true,
    },
    bankCode: {
      type: String,
      required: true,
    },
    bankSwiftCode: {
      type: String,
      required: true,
    },
    institutionId: {
      type: String,
      required: true,
    },
    hintText: {
      type: String,
      default: '',
    },
    accountMessageFormat: {
      type: String,
      required: true,
    },
    accountNumberLength: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
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
