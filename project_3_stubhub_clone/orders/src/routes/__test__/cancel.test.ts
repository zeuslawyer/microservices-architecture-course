import request from "supertest";

import { server } from "../../server";
import { makeTicket } from "../../test/setup";
import { OrderStatus } from "@zeuscoder-public/microservices-course-shared";
import { natsWrapper } from "../../nats-wrapper";

it("cancels order", async () => {
  const ticket = await makeTicket();
  const cookie = global.signin();
  // make order
  const { body: order } = await request(server)
    .post(`/api/orders`)
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: response } = await request(server)
    .put(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .expect(200);

  expect(response.status).toEqual(OrderStatus.Canceled);
});

it("throws Not Auth Error", async () => {
  const ticket = await makeTicket();

  // make order
  const { body: order } = await request(server)
    .post(`/api/orders`)
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: response } = await request(server)
    .put(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .expect(401);
});

it("Sends event that order canceled", async () => {
  const ticket = await makeTicket();
  const cookie = global.signin();
  // make order
  const { body: order } = await request(server)
    .post(`/api/orders`)
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: response } = await request(server)
    .put(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
