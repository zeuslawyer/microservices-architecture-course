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

    await stripe.charges.create({
      amount: order.price * 100, // cents
      currency: "usd",
      source: token,
      description: `Order charge applied for order id '${order.id}'`,
    });

    res.send("DONE");
  }
);

export { router as CreateChargeRouter };
