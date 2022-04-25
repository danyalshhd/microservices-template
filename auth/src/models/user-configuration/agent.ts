import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface AgentAttrs {
  name: string;
  address: string;
}

// An interface that describes the properties
// that a User Model has
interface AgentModel extends mongoose.Model<AgentDoc> {
  build(attrs: AgentAttrs): AgentDoc;
}

// An interface that describes the properties
// that a User Document has
interface AgentDoc extends mongoose.Document {
  name: string;
  address: string;
}

const AgentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
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

AgentSchema.statics.build = (attrs: AgentAttrs) => {
  return new Agent(attrs);
};

const Agent = mongoose.model<AgentDoc, AgentModel>('Agent', AgentSchema);

export { Agent };
