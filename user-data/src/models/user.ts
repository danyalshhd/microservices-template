import mongoose from 'mongoose';
// import { Password } from "../services/password";

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  email: string;
  phone_number: string;
  // deviceID: [string];
  // loginAttempt: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  onfidoApplicantId: string;
  onfidoCheckId: string;
  upgradeToMax: string;
  firstName: string;
  lastName: string;
  dob: string;
  trnNumber: string;
  streetAddress: Address;
  sourceOfIncome: string;
  profilePicture: string;
  phone_number: string;
  // deviceID: [string];
  // loginAttempt: string;
}

interface Address {
  parish: string;
  town: string;
  fullAddress: string;
}

const addressSchema = new mongoose.Schema(
  {
    parish: {
      type: String,
    },
    town: {
      type: String,
    },
    fullAddress: {
      type: String,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    dob: {
      type: String,
    },
    trnNumber: {
      type: String,
    },
    upgradeToMax: {
      type: String,
      enum: ['disabled', 'in_progress', 'enabled'],
      default: 'disabled',
    },
    streetAddress: {
      type: addressSchema,
    },
    sourceOfIncome: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    onfidoApplicantId: {
      type: String,
    },
    onfidoCheckId: {
      type: String,
    },
    // deviceID: {
    //   type: [String],
    //   required: true
    // },
    // loginAttempt: {
    //   type:String,
    //   required: true
    // },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// userSchema.pre("save", async function (done) {
//   if (this.isModified("password")) {
//     const hashed = await Password.toHash(this.get("password"));
//     this.set("password", hashed);
//   }
//   done();
// });

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
