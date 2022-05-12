import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface FAQAttrs {
  question: string;
  answer: string;
}

// An interface that describes the properties
// that a User Model has
interface SecretQuestionModel extends mongoose.Model<FAQDoc> {
  build(attrs: FAQAttrs): FAQDoc;
}

// An interface that describes the properties
// that a User Document has
interface FAQDoc extends mongoose.Document {
  question: string;
}

const FAQSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
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

FAQSchema.statics.build = (attrs: FAQAttrs) => {
  return new FAQ(attrs);
};

const FAQ = mongoose.model<FAQDoc, SecretQuestionModel>('FAQ', FAQSchema);

export { FAQ };
