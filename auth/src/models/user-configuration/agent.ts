import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface AgentAttrs {
  agentId: string;
  agentName: string;
  location: string;
  bankId: string;
  rating: Number;
  coordinates: Coordinates;
}

// An interface that describes the properties
// that a User Model has
interface AgentModel extends mongoose.Model<AgentDoc> {
  build(attrs: AgentAttrs): AgentDoc;
}

interface Coordinates {
  latitude: Number;
  longitude: Number;
}

// An interface that describes the properties
// that a User Document has
interface AgentDoc extends mongoose.Document {
  agentId: string;
  agentName: string;
  location: string;
  bankId: string;
  rating: Number;
  coordinates: Coordinates;
}

const coordinatesSchema = new mongoose.Schema(
  {
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
  },
  { _id: false }
);

const AgentSchema = new mongoose.Schema(
  {
    agentId: {
      type: String,
      required: true,
    },
    agentName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    bankId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
    },
    coordinates: {
      type: coordinatesSchema,
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
