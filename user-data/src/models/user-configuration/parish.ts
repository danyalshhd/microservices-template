import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface ParishAttrs {
  parishName: string;
  towns?: Array<Town>;
}

interface Town {
  townName: string;
}

// An interface that describes the properties
// that a User Model has
interface ParishModel extends mongoose.Model<ParishDoc> {
  build(attrs: ParishAttrs): ParishDoc;
}

// An interface that describes the properties
// that a User Document has
interface ParishDoc extends mongoose.Document {
  parishName: string;
  towns: Array<Town>;
}

const TownSchema = new mongoose.Schema(
  {
    townName: {
      type: String,
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

const ParishSchema = new mongoose.Schema(
  {
    parishName: {
      type: String,
      required: true,
    },
    towns: [{ type: TownSchema }],
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

ParishSchema.statics.build = (attrs: ParishAttrs) => {
  return new Parish(attrs);
};

const Parish = mongoose.model<ParishDoc, ParishModel>('Parish', ParishSchema);

export { Parish };
