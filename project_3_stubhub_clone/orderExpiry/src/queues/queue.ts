import Queue from "bull";

if (!process.env.REDIS_HOST) {
  throw new Error("Cannot find env var REDIS HOST");
}

export interface Payload {
  orderId: string;
}

const expirationQ = new Queue<Payload>("order:expiry", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQ.process(async job => {
  console.log(
    " I WANT TO PUBLISH AN EXPIRATION EVENT FOR ORDER ID",
    job.data.orderId
  );
});

export { expirationQ };
