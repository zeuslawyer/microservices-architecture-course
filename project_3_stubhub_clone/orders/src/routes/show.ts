import express, { Request, Response } from "express";
import {
  requireAuth,
  BadRequestError,
  NotFoundError,
  NoAuthError
} from "@zeuscoder-public/microservices-course-shared";
import { Order } from "../Models/Order";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    if (!orderId) throw new BadRequestError("Order Id null");

    const order = await Order.findById(orderId).populate("ticket"); // add the ticket property to returned order

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NoAuthError();

    res.status(200).send(order);
  }
);

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  // fetch orders and populate the tickets associated with each order
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    "ticket" // populate the property 'ticket' on Order
  );

  res.send(orders);
});

export { router as showOrderRouter };
