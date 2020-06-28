import mongoose from "mongoose";
import { PasswordManager } from "../services/PasswordManager";

export interface UserAttrs {
  email: string;
  password: string;
}

// interface that describes the properties of each User instance (the mongo document)
// which includes the additional props that mongo will add
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// interface that describes the properties of the User Schema ( the model )
// this includes the custom "build" method that we will add on to the Mongo User Schema
interface UserModel extends mongoose.Model<UserDoc> {
  build(userAttrs: UserAttrs): UserDoc;
}

// options to remove certain fields from the returned mongo doc when it is built
const schemaOpts: mongoose.SchemaOptions = {
  toJSON: {
    transform(doc, returned) {
      returned.id = returned._id;
      delete returned._id;
      delete returned.password; // remove password field in returned object
      delete returned.__v;
    }
  }
};

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String, // not typescript. Mongoose string (JS)
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  schemaOpts
);

// pre save hook/middleware to hash password whenever mongo .save() api is called
userSchema.pre("save", async function (done) {
  // only hash if the password field of the Document has been modified
  const doc = this; // since we are not using fat arrow func, this context is the Document
  if (doc.isModified("password")) {
    const hashed = await PasswordManager.toHash(doc.get("password"));
    doc.set("password", hashed);
  }

  done(); // must call this mongo method after async work is completed in mongo
});

// custom method called build to add typing to mongo api
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// the User model
export const User = mongoose.model<any, UserModel>("User", userSchema);
