import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import {
  NotFoundError,
  BadRequestError,
} from "@zeuscoder-public/microservices-course-shared";

const router = express.Router();

/**
 * get all tickets
 */
router.get("/api/tickets", async (req: Request, res: Response) => {
  const all = await Ticket.find({ orderId: undefined }); // exclude those that have an orderId => they're reserved
  if (!all) throw new NotFoundError();

  res.status(200).send(all);
});

/**
 * Get ticket by id
 */
router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).send(ticket);
});

export { router as showTicketRouter };
