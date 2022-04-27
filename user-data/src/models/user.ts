import mongoose from "mongoose";
// import { Password } from "../services/password";

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  mpin: string;
  biometric: boolean;
  secret_question: string;
  secret_answer: string;

}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  mpin: string;
  biometric: boolean;
  secret_question: string;
  secret_answer: string;
  lastLoginAttempt: string;
}

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mpin: {
      type: String,
      required: true
    },
    biometric: {
      type: Boolean,
      required: true 
    },
    secret_question: {
      type: String,
      required: true,
    },
    secret_answer: {
      type: String,
      required: true,
    },
    lastLoginAttempt: {
      type:String,
      required: false
    },
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

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
