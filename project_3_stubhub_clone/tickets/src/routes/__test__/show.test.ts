import request from "supertest";
import { server } from "../../server";
import mongoose from "mongoose";

async function createMockTicket() {
  // create ticket to return
  const mock = {
    title: "This is a mock title",
    price: 12.5
  };

  const ticket = await request(server).post("/api/tickets").set("Cookie", global.signin()).send(mock);

  return ticket.body;
}

it("returns 404 if ticket not found ", async () => {
  const mockId = mongoose.Types.ObjectId().toHexString(); // generate a valid mongo mock id

  const resp = await request(server).get(`/api/tickets/${mockId}`).send();
  expect(resp.status).toEqual(404);
});

it("returns ticket if found ", async () => {
  const ticket = await createMockTicket();
  // return ticket
  const fetched = await request(server)
    .get(`/api/tickets/${ticket.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(200);

  expect(fetched.body.title).toEqual(ticket.title);
  expect(fetched.body.price).toEqual(ticket.price);
});

it("returns all tickets - no auth required ", async () => {
  const ticketOne = await createMockTicket();
  const ticketTwo = await createMockTicket();

  const resp = await request(server).get("/api/tickets").send().expect(200);
  expect(resp.body.length).toEqual(2);
  expect(resp.body[0].title).toEqual(ticketOne.title);
  expect(resp.body[1].title).toEqual(ticketTwo.title);
});
