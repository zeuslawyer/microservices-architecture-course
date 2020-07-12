import request from "supertest";
import mongoose from "mongoose";

import { server } from "../../server";
import { Ticket } from "../../Models/Ticket";
import { Order } from "../../Models/Order";
import { OrderStatus } from "@zeuscoder-public/microservices-course-shared";
import { EXPIRATION_SECS } from "../create";
import { natsWrapper } from "../../nats-wrapper";

it("Fails without auth", async () => {
  await request(server)
    .post("/api/orders")
    .send({ ticketId: "afebwegbo" })
    .expect(401);
});

it("Returns error if ticket does not exist", async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(server)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

it("Returns error if ticket reserved", async () => {
  // create ticket
  const ticket = Ticket.build({ title: "Test Ticket", price: 123 });
  await ticket.save();

  // create order and associate ticket

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECS);

  const order = Order.build({
    userId: "dhvb3rt83f",
    ticket,
    status: OrderStatus.Created,
    expiresAt: expiration
  });
  await order.save();

  // check error is returned
  await request(server)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves ticket and checks the order returned from db", async () => {
  // create ticket
  const ticket = Ticket.build({ title: "Test Ticket", price: 123 });
  await ticket.save();

  // reserves ticket against order
  const order = await request(server)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(order.body).toHaveProperty("status");
  expect(order.body.status).toBe(OrderStatus.Created);
});

it("emits an order created event", async () => {
  const ticket = Ticket.build({ title: "Test Ticket", price: 123 });
  await ticket.save();

  // reserves ticket against order
  const order = await request(server)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id });

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
