import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new User
interface CountryAttrs {
  countryName: string;
  countryCode: string;
  phonePrefix: string;
  flag: string;
}

// An interface that describes the properties
// that a User Model has
interface CountryModel extends mongoose.Model<CountryDoc> {
  build(attrs: CountryAttrs): CountryDoc;
}

// An interface that describes the properties
// that a User Document has
interface CountryDoc extends mongoose.Document {
  countryName: string;
  countryCode: string;
  phonePrefix: string;
  flag: string;
  visible: boolean;
}

const CountrySchema = new mongoose.Schema(
  {
    countryName: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    phonePrefix: {
      type: String,
      required: true,
    },
    flag: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
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

CountrySchema.statics.build = (attrs: CountryAttrs) => {
  return new Country(attrs);
};

const Country = mongoose.model<CountryDoc, CountryModel>(
  'Country',
  CountrySchema
);

export { Country };
