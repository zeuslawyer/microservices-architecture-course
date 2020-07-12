import express, { Request, Response } from "express";
import {
  requireAuth,
  OrderStatus,
  NotFoundError,
  NoAuthError
} from "@zeuscoder-public/microservices-course-shared";

import { Order } from "../Models/Order";
import { OrderCanceledPublisher } from "../Events/Publishers/OrderCanceledPublisher";
import { natsWrapper } from "../nats-wrapper";
import { Ticket } from "../Models/Ticket";

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

    // send EVENT
    new OrderCanceledPublisher(natsWrapper.client).publish({
      id: order.id,
      userId: req.currentUser!.id,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      ticket: { id: order.ticket.id, price: order.ticket.price }
    });

    res.status(200).send(order);
  }
);

export { router as cancelOrderRouter };
