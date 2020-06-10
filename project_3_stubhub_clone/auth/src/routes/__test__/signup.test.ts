import request from "supertest";
import { server } from "../../server";

it("returns 201 on successful signup ", async () => {
  return request(server)
    .post("/api/users/signup")
    .send({
      email: "test@testing.com",
      password: "password"
    })
    .expect(201);
});

it("Disallowed duplicate emails", async () => {
  // sign up
  await request(server)
    .post("/api/users/signup")
    .send({
      email: "test@testing.com",
      password: "password"
    })
    .expect(201);

  // test
  return request(server)
    .post("/api/users/signup")
    .send({
      email: "test@testing.com",
      password: "password"
    })
    .expect(400);
});

it("returns 400 error with incorrect signup credentials ", async () => {
  await request(server).post("/api/users/signup").send({ email: "fakeemail", password: "24t93r7b8yi" }).expect(400);
  await request(server).post("/api/users/signup").send({ email: "fakeemail@gmail.com", password: "3e" }).expect(400);
  // no need for return statement since we have awaits
});

it("confirms jwt sent as cookie in resp header", async () => {
  const response = await request(server)
    .post("/api/users/signup")
    .send({
      email: "cookie@testing.com",
      password: "password"
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
