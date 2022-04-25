import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface PrivacyPolicyAttrs {
  policy: string;
}

// An interface that describes the properties
// that a User Model has
interface PrivacyPolicyModel extends mongoose.Model<PrivacyPolicyDoc> {
  build(attrs: PrivacyPolicyAttrs): PrivacyPolicyDoc;
}

// An interface that describes the properties
// that a User Document has
interface PrivacyPolicyDoc extends mongoose.Document {
  policy: string;
}

const PrivacyPolicySchema = new mongoose.Schema(
  {
    policy: {
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

PrivacyPolicySchema.statics.build = (attrs: PrivacyPolicyAttrs) => {
  return new PrivacyPolicy(attrs);
};

const PrivacyPolicy = mongoose.model<PrivacyPolicyDoc, PrivacyPolicyModel>(
  'PrivacyPolicy',
  PrivacyPolicySchema
);

export { PrivacyPolicy };
