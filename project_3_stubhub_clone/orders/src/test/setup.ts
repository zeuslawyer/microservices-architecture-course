import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Ticket } from "../Models/Ticket";

// set up by creating the in mem db and mongoose connection
let mongo: any;

jest.mock("../nats-wrapper.ts"); // path to real file that needs to be mocked

export const makeTicket = async () => {
  const ticket = Ticket.build({
    title: "meh 1",
    price: 12,
    id: mongoose.Types.ObjectId().toHexString()
  });

  await ticket.save();
  return ticket;
};

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

// mock up cookie creation for route requests
global.signin = () => {
  // Build a mock JWT payload
  const payload = {
    email: "test@test-tickets.com",
    id: mongoose.Types.ObjectId().toHexString() // make fake uid
  };

  // create the JWT with the .sign() function
  const token = jwt.sign(payload, process.env.JWT_KEY!); // env var is already loaded into node in the beforeAll call

  // mock up session object, as it would look by base64 decoding the session cookie from browser
  const session = { jwt: token };
  // convert to JSON
  const sessionJson = JSON.stringify(session);

  // encode to base 64 string so it looks like cookie
  const base64 = Buffer.from(sessionJson).toString("base64");

  return [`express:sess=${base64}`]; // same format as how the cooke shows in a browser network request header
};

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
  jest.clearAllMocks(); // reset state in mock functions

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
