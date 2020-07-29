import { TicketCreatedListener } from "../TicketCreatedListener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@zeuscoder-public/microservices-course-shared";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../Models/Ticket";

const setup = async () => {
  // create listener instance
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create fake data
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 55,
    title: "Concert",
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0
  };

  // create fake NATS message
  const msg: Partial<Message> = {
    ack: jest.fn()
  };

  return { listener, data, msg };
};

it("create and save ticket on event received ", async () => {
  const { listener, data, msg } = await setup();

  // invoke handleMessage()

  await listener.handleMessage(data, msg as Message);

  // test ticket created
  const ticket = await Ticket.findById(data.id);
  expect(ticket!.title).toEqual(data.title);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // invoke handleMessage()
  await listener.handleMessage(data, msg as Message);
  //test ticket created
  expect(msg.ack).toHaveBeenCalled();
});
