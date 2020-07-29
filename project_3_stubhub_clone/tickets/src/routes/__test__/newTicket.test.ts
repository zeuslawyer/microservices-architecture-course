import request from "supertest";
import { server } from "../../server";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a valid route handler at /api/tickets for post requests ", async () => {
  const response = await request(server).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("checks user is authenticated before handling request ", async () => {
  return await request(server).post("/api/tickets").send({}).expect(401); // check common/src/Errors/NoAuth
});

it("Returns status other than 401 if user signed in ", async () => {
  const response = await request(server).post("/api/tickets").set("Cookie", global.signin()).send({});

  expect(response.status).not.toEqual(401); // check common/src/Errors/NoAuth for status code
});

it("returns error if invalid title provided ", async () => {
  const responseEmptyTitle = await request(server).post("/api/tickets").set("Cookie", global.signin()).send({
    title: "",
    price: 10
  });

  const responseNoTitle = await request(server).post("/api/tickets").set("Cookie", global.signin()).send({
    price: 10
  });
  // common/RequestValidationError - 400
  expect(responseEmptyTitle.status).toEqual(400);
  expect(responseNoTitle.status).toEqual(400);
});

it("returns error if invalid price provided", async () => {
  const responseInvalidPrice = await request(server).post("/api/tickets").set("Cookie", global.signin()).send({
    title: "This is a bad movie",
    price: -10
  });
  const responseNoPrice = await request(server).post("/api/tickets").set("Cookie", global.signin()).send({
    title: "This is a bad movie"
  });

  // common/RequestValidationError - 400
  expect(responseInvalidPrice.status).toEqual(400);
  expect(responseNoPrice.status).toEqual(400);
});

it("creates a ticket with valid inputs ", async () => {
  let tickets = await Ticket.find({}); // find all
  const initialLength = 0;

  expect(tickets.length).toEqual(initialLength); // in setup.js, after every test we empty all collections

  await request(server)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "This is a good movie",
      price: 20.5
    })
    .expect(201);

  tickets = await Ticket.find({}); // find all
  expect(tickets.length).toEqual(initialLength + 1);
  expect(tickets[0].price).toEqual(20.5);
});

it("Publishes an event", async () => {
  await request(server).post("/api/tickets").set("Cookie", global.signin()).send({
    title: "Publishing an event",
    price: 25.5
  });

  // test event published
  expect(natsWrapper.client.publish).toHaveBeenCalled(); // natsWrapper here will be the one in __mock__
});
