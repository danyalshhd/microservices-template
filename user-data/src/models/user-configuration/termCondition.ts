import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface TermConditionAttrs {
  condition: string;
}

// An interface that describes the properties
// that a User Model has
interface TermConditionModel extends mongoose.Model<TermConditionDoc> {
  build(attrs: TermConditionAttrs): TermConditionDoc;
}

// An interface that describes the properties
// that a User Document has
interface TermConditionDoc extends mongoose.Document {
  condition: string;
}

const TermConditionSchema = new mongoose.Schema(
  {
    condition: {
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

TermConditionSchema.statics.build = (attrs: TermConditionAttrs) => {
  return new TermCondition(attrs);
};

const TermCondition = mongoose.model<TermConditionDoc, TermConditionModel>(
  'TermCondition',
  TermConditionSchema
);

export { TermCondition };
