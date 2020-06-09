import request from "supertest";
import { server } from "../../server";

it("returns 201 on successful signup ", async () => {
  return request(server)
    .post("/api/users/signup")
    .send({
      email: "gumbal@testing.com",
      password: "password"
    })
    .expect(201);
});
