import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface BillCompanyAttrs {
  companyName: string;
  billCategory: mongoose.Schema.Types.ObjectId;
  billAccount: string;
  paymentType: string;
}

// An interface that describes the properties
// that a User Model has
interface BillCompanyModel extends mongoose.Model<BillCompanyDoc> {
  build(attrs: BillCompanyAttrs): BillCompanyDoc;
}

// An interface that describes the properties
// that a User Document has
interface BillCompanyDoc extends mongoose.Document {
  companyName: string;
  billCategory: mongoose.Schema.Types.ObjectId;
  billAccount: string;
  paymentType: string;
}

const BillCompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    billCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BillCategory',
      required: true,
    },
    billAccount: {
      type: String,
      required: true,
    },
    paymentType: {
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
        if(Object.keys(ret.billCategory).length>0){
          ret.billCategoryName = ret.billCategory.categoryName;
          ret.billCategoryId = ret.billCategory.id;
          delete ret.billCategory;
        }
      },
    },
  }
);

BillCompanySchema.statics.build = (attrs: BillCompanyAttrs) => {
  return new BillCompany(attrs);
};

const BillCompany = mongoose.model<BillCompanyDoc, BillCompanyModel>(
  'BillCompany',
  BillCompanySchema
);

export { BillCompany };
