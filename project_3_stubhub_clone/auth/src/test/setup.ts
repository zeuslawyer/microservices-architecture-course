import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { server } from "../server";

// set up by creating the in mem db and mongoose connection
let mongo: any;
beforeAll(async () => {
  // set the JWT_KEY env var as its not currently available outside the pod
  process.env.JWT_KEY = "bwt408hblahBLAH";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// flush out the db before each test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let coll of collections) {
    await coll.deleteMany({}, () => {}); // confirm that coll deleted
  }
});

// cleanup and disconnect
afterAll(async () => {
  await mongo.stop();
  console.log("*** In memory database stopped. ***");
});
