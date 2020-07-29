import { OrderCanceledListener } from "../OrderCanceledListener";
import { natsWrapper } from "../../../nats-wrapper";

import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import {
  OrderCanceledEvent,
  OrderStatus,
} from "@zeuscoder-public/microservices-course-shared";
import { OrderCreatedListener } from "../OrderCreatedListener";
import { qGroupName } from "../qGroupName";

const setup = async () => {
  const listener = new OrderCanceledListener(natsWrapper.client);
  const ticket = Ticket.build({
    title: "Banana Bread",
    price: 14,
    userId: "4yerfbr",
  });

  // set orderId property
  const orderId = mongoose.Types.ObjectId().toHexString();
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCanceledEvent["data"] = {
    id: orderId,
    userId: "4yerfbr",
    version: 0,
    status: OrderStatus.Canceled,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    expiresAt: "XXXX",
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("updates ticket, publishes event, acks", async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.handleMessage(data, msg);

  const updated = await Ticket.findById(ticket.id);

  expect(msg.ack).toHaveBeenCalled();
  expect(updated!.orderId).toBeUndefined();

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
