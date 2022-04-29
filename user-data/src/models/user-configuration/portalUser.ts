import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface PortalUserAttrs {
  name: string;
  email: string;
  role: string;
}

// An interface that describes the properties
// that a User Model has
interface PortalUserModel extends mongoose.Model<PortalUserDoc> {
  build(attrs: PortalUserAttrs): PortalUserDoc;
}

// An interface that describes the properties
// that a User Document has
interface PortalUserDoc extends mongoose.Document {
  name: string;
  email: string;
  role: string;
  password: string;
}

const PortalUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    }
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

PortalUserSchema.statics.build = (attrs: PortalUserAttrs) => {
  return new PortalUser(attrs);
};

const PortalUser = mongoose.model<PortalUserDoc, PortalUserModel>('PortalUser', PortalUserSchema);

export { PortalUser};
