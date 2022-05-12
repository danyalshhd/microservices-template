import mongoose from 'mongoose';
// import { Password } from "../services/password";

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  _id: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phoneNumber: string;
  password: string;
  mpin: string;
  biometric: boolean;
  secretQuestion: string;
  secretAnswer: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  onfidoApplicantId: string;
  onfidoCheckId: string;
  upgradeToMax: string;
  trnNumber: string;
  streetAddress: Address;
  sourceOfIncome: string;
  profilePicture: string;
  phoneNumber: string;
  password: string;
  mpin: string;
  biometric: boolean;
  secretQuestion: string;
  secretAnswer: string;
  lastLoginAttempt: string;
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
    _id: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phoneNumber: {
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
    password: {
      type: String,
      required: true,
    },
    mpin: {
      type: String,
      required: true,
    },
    biometric: {
      type: Boolean,
      required: true,
    },
    secretQuestion: {
      type: String,
      required: true,
    },
    secretAnswer: {
      type: String,
      required: true,
    },
    lastLoginAttempt: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc: any, ret: any) {
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
