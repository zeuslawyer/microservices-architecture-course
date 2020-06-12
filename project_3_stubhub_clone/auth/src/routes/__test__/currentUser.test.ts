import request from "supertest";
import { server } from "../../server";

it(" tests current user endpoint returns the logged in user", async () => {
  const user = {
    email: "test@testing.com",
    password: "password"
  };

  const resp = await request(server).post("/api/users/signup").send(user).expect(201);
  // extract cookie as tests dont have browser env, so server wont receive cookie in next response unless we add it!
  const cookie = resp.get("Set-Cookie");

  const testResp = await request(server).get("/api/users/currentuser").set("Cookie", cookie).expect(200);

  expect(testResp.body.currentUser.email).toEqual(user.email);
  expect(testResp.body.currentUser.id).toBeDefined();
});

it("tests current user endpoint returns null current user", async () => {
  const testResp = await request(server).get("/api/users/currentuser").set("Cookie", "fake-cookie").expect(200);
  expect(testResp.body.currentUser).toEqual(null);
});
