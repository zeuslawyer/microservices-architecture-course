import request from "supertest";
import { server } from "../../server";
import mongoose from "mongoose";
import { Order } from "../../models/Order";
import { OrderStatus } from "@zeuscoder-public/microservices-course-shared";

import { stripe } from "../../stripe";
import { Payment } from "../../models/Payment";
jest.mock("../../stripe.ts");

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(server)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asldkfj",
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(server)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asldkfj",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Canceled,
  });
  await order.save();

  await request(server)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      orderId: order.id,
      token: "asdlkfj",
    })
    .expect(400);
});

it("test stripe mock - return 201", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(server)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      orderId: order.id,
      token: "tok_amex",
    })
    .expect(201);

  const invocationNum = 0;
  const argNum = 0;
  const chargeOpts = (stripe.charges.create as jest.Mock).mock.calls[
    invocationNum
  ][argNum];

  expect(chargeOpts.source).toEqual("tok_amex");
  expect(chargeOpts.amount).toEqual(order.price * 100);
  expect(chargeOpts.currency).toEqual("usd");
});

it("should ", async () => {});
