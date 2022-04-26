import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface SecretQuestionAttrs {
  question: string;
}

// An interface that describes the properties
// that a User Model has
interface SecretQuestionModel extends mongoose.Model<SecretQuestionDoc> {
  build(attrs: SecretQuestionAttrs): SecretQuestionDoc;
}

// An interface that describes the properties
// that a User Document has
interface SecretQuestionDoc extends mongoose.Document {
  question: string;
}

const SecretQuestionSchema = new mongoose.Schema(
  {
    question: {
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

SecretQuestionSchema.statics.build = (attrs: SecretQuestionAttrs) => {
  return new SecretQuestion(attrs);
};

const SecretQuestion = mongoose.model<SecretQuestionDoc, SecretQuestionModel>(
  'SecretQuestion',
  SecretQuestionSchema
);

export { SecretQuestion };
