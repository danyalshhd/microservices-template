import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface TownAttrs {
  townName: string;
  parish: mongoose.Schema.Types.ObjectId;
}


// An interface that describes the properties
// that a User Model has
interface TownModel extends mongoose.Model<TownDoc> {
  build(attrs: TownAttrs): TownDoc;
}

// An interface that describes the properties
// that a User Document has
interface TownDoc extends mongoose.Document {
  townName: string;
  parish: mongoose.Schema.Types.ObjectId;
}

const TownSchema = new mongoose.Schema(
  {
    townName: {
      type: String,
      required: true,
    },
    parish: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Parish'
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

TownSchema.statics.build = (attrs: TownAttrs) => {
  return new Town(attrs);
};

const Town = mongoose.model<TownDoc, TownModel>('Town', TownSchema);

export { Town};
