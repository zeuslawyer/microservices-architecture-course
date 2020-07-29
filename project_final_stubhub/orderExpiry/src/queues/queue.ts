import Queue from "bull";
import { OrderExpiredPublisher } from "../events/publishers/OrderExpiredPublisher";
import { natsWrapper } from "../nats-wrapper";

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
  await new OrderExpiredPublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQ };
