import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  handleRequestValidation,
  BadRequestError,
  NotFoundError,
  NoAuthError,
  OrderStatus,
} from "@zeuscoder-public/microservices-course-shared";

import { Order } from "../models/Order";
import { stripe } from "../stripe";
import { PaymentCreatedPublisher } from "../events/publishers/PaymentCreatedPublisher";
import { natsWrapper } from "../nats-wrapper";
import { Payment } from "../models/Payment";

const router = express.Router();

const validations = [
  body("token").not().isEmpty(),
  body("orderId").not().isEmpty(),
];

router.post(
  "/api/payments",
  requireAuth,
  validations,
  handleRequestValidation,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NoAuthError();
    }

    if (order.status === OrderStatus.Canceled) {
      throw new BadRequestError(
        `Order has status of canceled.  Cannot take payment for it.`
      );
    }

    const charge = await stripe.charges.create({
      amount: order.price * 100, // cents
      currency: "usd",
      source: token,
      description: `Order charge applied for order id '${order.id}'`,
    });

    const payment = new Payment({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.id,
    });

    res.status(201).send(payment);
  }
);

export { router as CreateChargeRouter };
