import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface BillCategoryAttrs {
  categoryName: string;
}

// An interface that describes the properties
// that a User Model has
interface BillCategoryModel extends mongoose.Model<BillCategoryDoc> {
  build(attrs: BillCategoryAttrs): BillCategoryDoc;
}

// An interface that describes the properties
// that a User Document has
interface BillCategoryDoc extends mongoose.Document {
  categoryName: string;
}

const BillCategorySchema = new mongoose.Schema(
  {
    categoryName: {
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

BillCategorySchema.statics.build = (attrs: BillCategoryAttrs) => {
  return new BillCategory(attrs);
};

const BillCategory = mongoose.model<BillCategoryDoc, BillCategoryModel>(
  'BillCategory',
  BillCategorySchema
);

export { BillCategory };
