import request from "supertest";
import { server } from "../../server";
import mongoose from "mongoose";

it("returns 404 if ticket not found ", async () => {
  const mockId = mongoose.Types.ObjectId().toHexString(); // generate a valid mongo mock di

  const resp = await request(server).get(`/api/tickets/${mockId}`).send();
  expect(resp.status).toEqual(404);
});

it("returns ticket if found ", async () => {
  // create ticket to return
  const mock = {
    title: "This is a mock title",
    price: 12.5
  };

  const ticket = await request(server).post("/api/tickets").set("Cookie", global.signin()).send(mock).expect(201);

  // return ticket
  const fetched = await request(server)
    .get(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(200);

  expect(fetched.body.title).toEqual(mock.title);
  expect(fetched.body.price).toEqual(mock.price);
});
