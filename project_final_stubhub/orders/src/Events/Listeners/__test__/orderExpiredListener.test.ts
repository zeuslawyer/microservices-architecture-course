import { OrderExpiredListener } from "../OrderExpiredListener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../Models/Ticket";

import mongoose from "mongoose";
import { Order } from "../../../Models/Order";
import {
  OrderStatus,
  OrderExpiredEvent,
} from "@zeuscoder-public/microservices-course-shared";

const setup = async () => {
  const listener = new OrderExpiredListener(natsWrapper.client);

  // build ticket
  const ticket = Ticket.build({
    title: "Baboobeee",
    price: 10,
    id: mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  // build order
  const order = Order.build({
    userId: "wegre234r",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });

  await order.save();

  // create event message
  const data: OrderExpiredEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { ticket, order, data, msg, listener };
};

it("updates order status to CANCELLED ", async () => {
  const { order, data, msg, listener } = await setup();
  await listener.handleMessage(data, msg);

  const updated = await Order.findById(order.id);

  expect(updated!.status).toEqual(OrderStatus.Canceled);
});

it("emits order CANCELLED EVENT", async () => {
  const { order, data, msg, listener } = await setup();
  await listener.handleMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const firstCall = 0;
  const secondArg = 1;
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[firstCall][secondArg] // calls is array of all the times the func was invoked, and its inner arrays contain the args passed
  );

  expect(eventData.id).toEqual(order.id);
});

it("acks the message", async () => {
  const { data, msg, listener } = await setup();
  await listener.handleMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
