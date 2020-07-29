import request from "supertest";

import { server } from "../../server";
import { Ticket } from "../../Models/Ticket";
import mongoose from "mongoose";
import { makeTicket } from "../../test/setup";

it("shows Not Auth Error", async () => {
  const user = global.signin();
  const t = await makeTicket();

  // create order with this ticket
  const { body: createdOrder } = await request(server)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: t.id });

  // attempt fetch by another user
  const unauthUser = global.signin();
  await request(server)
    .get(`/api/orders/${createdOrder.id}`)
    .set("Cookie", unauthUser)
    .expect(401);
});

it("shows Not Found Error", async () => {
  const orderId = mongoose.Types.ObjectId();

  await request(server)
    .get(`/api/orders/${orderId}`)
    .set("Cookie", global.signin())
    .expect(404);
});

it("fetches a single order by id", async () => {
  const user = global.signin();
  const t = await makeTicket();

  // create order with this ticket
  const { body: createdOrder } = await request(server)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: t.id });

  // fetch order
  const { body: returned } = await request(server)
    .get(`/api/orders/${createdOrder.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(createdOrder.id).toEqual(returned.id);
  expect(returned.ticket.id).toEqual(t.id);
});

it("fetches orders", async () => {
  // create three tickets
  const t1 = await makeTicket();
  const t2 = await makeTicket();
  const t3 = await makeTicket();

  const user1 = global.signin();
  const user2 = global.signin();

  // create one order as user 1
  await request(server)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: t1.id });

  // create 2 orders as user 2
  const { body: o1 } = await request(server)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: t2.id });

  const { body: o2 } = await request(server)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: t3.id });

  // test orders for user 2
  const { body: orders } = await request(server)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(200);

  expect(orders.length).toBe(2);
  expect(o1.id).toEqual(orders[0].id);
  expect(o2.id).toEqual(orders[1].id);
  expect(orders[0].ticket.id).toEqual(t2.id);
  expect(orders[1].ticket.id).toEqual(t3.id);
});
