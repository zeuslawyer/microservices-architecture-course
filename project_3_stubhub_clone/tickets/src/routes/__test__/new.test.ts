import request from "supertest";
import { server } from "../../server";

it("has a valid route handler at /api/tickets for post requests ", async () => {
  const response = await request(server).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("checks user is authenticated before handling request ", async () => {
  return await request(server).post("/api/tickets").send({}).expect(401); // check common/src/Errors/NoAuth
});

it("Returns status other than 401 if user signed in ", async () => {
  const response = await request(server)
    .post("/api/tickets")
    //.set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401); // check common/src/Errors/NoAuth
});

xit("returns error if invalid title provided ", () => {});

xit("returns error if invalid price provided", () => {});
xit("creates a ticket with valid inputs ", () => {});
