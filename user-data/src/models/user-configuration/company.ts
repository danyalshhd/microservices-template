import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface CompanyAttrs {
  companyName: string;
  category: string;
  paymentType: string;
}

// An interface that describes the properties
// that a User Model has
interface CompanyModel extends mongoose.Model<CompanyDoc> {
  build(attrs: CompanyAttrs): CompanyDoc;
}

// An interface that describes the properties
// that a User Document has
interface CompanyDoc extends mongoose.Document {
  companyName: string;
  category: string;
  paymentType: string;
}

const CompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    category: {
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
      },
    },
  }
);

CompanySchema.statics.build = (attrs: CompanyAttrs) => {
  return new Company(attrs);
};

const Company = mongoose.model<CompanyDoc, CompanyModel>(
  'Company',
  CompanySchema
);

export { Company };
