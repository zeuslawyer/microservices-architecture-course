import express, { Request, Response, NextFunction } from "express";
import {
  requireAuth,
  handleRequestValidation,
  NotFoundError,
  BadRequestError,
  OrderStatus,
} from "@zeuscoder-public/microservices-course-shared";
import { body } from "express-validator";
import mongoose from "mongoose";

import { Ticket } from "../Models/Ticket";
import { Order } from "../Models/Order";
import { OrderCreatedPublisher } from "../Events/Publishers/OrderCreatedPublisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();
export const EXPIRATION_SECS = 2 * 60; // 2 mins

const validation = [
  body("ticketId")
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input)), // is valid mongoose id.  but causes coupling between db and orders service
];

/**  create a new order given a ticket Id */
router.post(
  "/api/orders",
  requireAuth,
  validation,
  handleRequestValidation,
  async (req: Request, res: Response) => {
    // retrieve ticket from db
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    // check ticket is not reserved by another order
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError(
        `Order Service: order for ticket '${ticketId}' already exists.`
      );
    }

    // set expiry of order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECS);

    // build and store order with the ticket Id associated
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      userId: req.currentUser!.id,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
