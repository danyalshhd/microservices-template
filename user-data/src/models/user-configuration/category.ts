import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface CategoryAttrs {
  name: string;
  country: string;
  visible: boolean;
}

// An interface that describes the properties
// that a User Model has
interface CategoryModel extends mongoose.Model<CategoryDoc> {
  build(attrs: CategoryAttrs): CategoryDoc;
}

// An interface that describes the properties
// that a User Document has
interface CategoryDoc extends mongoose.Document {
  name: string;
  country: string;
  visible: boolean;
}

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
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

categorySchema.statics.build = (attrs: CategoryAttrs) => {
  return new Category(attrs);
};

const Category = mongoose.model<CategoryDoc, CategoryModel>(
  'Category',
  categorySchema
);

export { Category };
