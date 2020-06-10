import request from "supertest";
import { server } from "../../server";

it(" Successfully signs user out ", async () => {
  await request(server)
    .post("/api/users/signup")
    .send({
      email: "test@testing.com",
      password: "password"
    })
    .expect(201);
  const resp = await request(server).post("/api/users/signout").send({}).expect(200);
  expect(resp.text).toBe("Signed out.");
});
