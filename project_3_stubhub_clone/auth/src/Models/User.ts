import mongoose, { MongooseDocument } from "mongoose";

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

userSchema.statics.build = (user: UserAttrs) => {
  return new User(user);
};

export const User = mongoose.model<any, UserModel>("User", userSchema);
