import request from "supertest";
import { server } from "../../server";

it("returns 200 on successful sign in ", async () => {
  await request(server)
    .post("/api/users/signup")
    .send({
      email: "test@testing.com",
      password: "password"
    })
    .expect(201);
  return request(server)
    .post("/api/users/signin")
    .send({
      email: "test@testing.com",
      password: "password"
    })
    .expect(200);
});

it("Confirms JWT sent in cookie in response header on sign in", async () => {
  await request(server)
    .post("/api/users/signup")
    .send({
      email: "test@testing.com",
      password: "password"
    })
    .expect(201);

  const resp = await request(server)
    .post("/api/users/signin")
    .send({
      email: "test@testing.com",
      password: "password"
    })
    .expect(200);

  expect(resp.get("Set-Cookie")).toBeDefined();
});

it("returns 200 on successful sign in ", async () => {
  await request(server)
    .post("/api/users/signup")
    .send({
      email: "test@testing.com",
      password: "password"
    })
    .expect(201);
  return request(server)
    .post("/api/users/signin")
    .send({
      email: "test@testing.com",
      password: "password"
    })
    .expect(200);
});

it("fails on sign in if no user ", async () => {
  return request(server)
    .post("/api/users/signin")
    .send({
      email: "fail@testing.com",
      password: "password"
    })
    .expect(400);
});

it("fails on sign in if wrong password ", async () => {
  await request(server)
    .post("/api/users/signup")
    .send({
      email: "test@testing.com",
      password: "password"
    })
    .expect(201);

  return request(server)
    .post("/api/users/signin")
    .send({
      email: "test@testing.com",
      password: "pass"
    })
    .expect(400);
});
