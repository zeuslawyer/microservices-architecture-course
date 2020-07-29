import { OrderCreatedListener } from "../OrderCreatedListener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

import {
  OrderCanceledEvent,
  OrderStatus
} from "@zeuscoder-public/microservices-course-shared";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create a ticket
  const ticket = Ticket.build({
    title: "Random OMG",
    price: 55,
    userId: "werg4ty5"
  });

  await ticket.save();

  // build fake event data
  const data: OrderCanceledEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    },
    userId: "werg4ty5",
    status: OrderStatus.Created,
    expiresAt: "3rgtgrf",
    version: 0
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, data, msg };
};

it("sets user Id on Ticket ", async () => {
  const { listener, ticket, msg, data } = await setup();
  await listener.handleMessage(data, msg);

  // fetch the ticket again to check that the listener updated it
  const updated = await Ticket.findById(ticket.id);
  expect(updated?.orderId).toEqual(data.id);
});

it("acks the message ", async () => {
  const { listener, ticket, msg, data } = await setup();
  await listener.handleMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
