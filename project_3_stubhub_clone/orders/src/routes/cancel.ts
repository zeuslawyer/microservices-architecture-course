import express, { Request, Response } from "express";
import {
  requireAuth,
  OrderStatus,
  NotFoundError,
  NoAuthError
} from "@zeuscoder-public/microservices-course-shared";

import { Order } from "../Models/Order";

const router = express.Router();

router.put(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NoAuthError();

    // cancel order
    order.status = OrderStatus.Canceled;
    await order.save();

    res.status(200).send(order);
  }
);

export { router as cancelOrderRouter };
