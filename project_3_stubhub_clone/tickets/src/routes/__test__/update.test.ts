import request from "supertest";
import mongoose from "mongoose";

import { server } from "../../server";
import { natsWrapper } from "../../nats-wrapper";

it("shows 404 if id does not exist ", async () => {
  const mockId = mongoose.Types.ObjectId().toHexString(); // generate a valid mongo mock id

  await request(server)
    .put(`/api/tickets/${mockId}`)
    .set("Cookie", global.signin())
    .send({ title: "does not exist", price: 13.5 })
    .expect(404);
});

it("returns 401 not authorized  ", async () => {
  const mockId = mongoose.Types.ObjectId().toHexString(); // generate a valid mongo mock id

  await request(server).put(`/api/tickets/${mockId}`).send({ title: "does not exist", price: 13.5 }).expect(401);
});

it("returns 401 not authorized if user does not own ticket", async () => {
  // create ticket
  const ticket = await request(server)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "testing title", price: 20 });

  // try to update it as a new user - set new user session cookie by calling signin() again

  await request(server)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "new randomg title", price: 10 })
    .expect(401);
});

it("return 400 if invalid title or price ", async () => {
  // create ticket
  const cookie = global.signin();
  const response = await request(server)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "any old title", price: 20 });

  // bad price
  await request(server)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "ok title but bad price", price: -20 })
    .expect(400);

  // bad title
  await request(server)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: undefined, price: 10 })
    .expect(400);
});

it("updates ticket if valid inputs", async () => {
  // create ticket
  const cookie = global.signin();
  const response = await request(server)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "any old title", price: 20 });

  await request(server)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "some new title",
      price: 100
    })
    .expect(200);

  // fetch the ticket

  const updated = await request(server).get(`/api/tickets/${response.body.id}`).send();

  expect(updated.body.title).toEqual("some new title");
  expect(updated.body.price).toEqual(100);
});

it("publishes event on update", async () => {
  // create ticket
  const cookie = global.signin();
  const response = await request(server)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "Publish on Ticket Update", price: 10.75 });

  await request(server).put(`/api/tickets/${response.body.id}`).set("Cookie", cookie).send({
    title: "some new title on Ticket Update",
    price: 23.5
  });

  expect(natsWrapper.client.publish).toHaveBeenCalled(); // natsWrapper here will be the one in __mock__
});
