import mongoose, { MongooseDocument } from "mongoose";
import { Password } from "../services/password";

export interface UserAttrs {
  email: string;
  password: string;
}

// interface that describes the properties of the User Schema ( the model )
// i.e. the typescript description of the mongo Schema for a User model
// this includes the custom "build" method that we will add on to the Mongo User Schema
interface UserModel extends mongoose.Model<UserInstance> {
  build(userAttrs: UserAttrs): UserInstance;
}

// interface that describes the properties of each User instance (the mongo document)
// which includes the additional props that mongo will add
interface UserInstance extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String, // not typescript. Mongoose string
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// pre save hook/middleware to hash password whenever mongo .save() api is called
userSchema.pre("save", async function (done) {
  // only hash if the password field of the Document has been modified
  const doc = this; // since we are not using fat arrow func, this context is the Document
  if (doc.isModified("password")) {
    const hashed = await Password.toHash(doc.get("password"));
    doc.set("password", hashed);
  }

  done(); // must call this mongo method after async work is completed in mongo
});

// custom method called build to add typing to mongo api
userSchema.statics.build = (user: UserAttrs) => {
  return new User(user);
};

export const User = mongoose.model<any, UserModel>("User", userSchema);
