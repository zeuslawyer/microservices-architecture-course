import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@zeuscoder-public/microservices-course-shared";
import mongoose, { mongo } from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../Models/Ticket";
import { TicketUpdatedListener } from "../TicketUpdatedListener";

const setup = async () => {
  // create listener instance
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // build a ticket
  const ticket = Ticket.build({
    title: "Test Ticket",
    price: 103,
    id: mongoose.Types.ObjectId().toHexString()
  });

  await ticket.save();

  // updated ticket
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    price: 55,
    title: "Concert",
    userId: mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1
  };

  // create fake NATS message
  const msg: Partial<Message> = {
    ack: jest.fn()
  };

  return { listener, data, msg, ticket };
};

it(" finds, updates, saves updated ticket data with updated version ", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.handleMessage(data, msg as Message);

  // check updated ticket props
  const updated = await Ticket.findById(ticket.id);
  expect(updated!.title).toBe(data.title);
  expect(updated!.version).toBe(data.version);
});

it("fails on incorrect version number - no ack called", async () => {
  const { listener, data, msg, ticket } = await setup();
  // increment updated ticket's version number
  data.version = 12;

  try {
    await listener.handleMessage(data, msg as Message);
  } catch (error) {
    expect(error).toBeDefined();
  }

  expect(msg.ack).not.toHaveBeenCalled();
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.handleMessage(data, msg as Message);
  expect(msg.ack).toHaveBeenCalled();
});
