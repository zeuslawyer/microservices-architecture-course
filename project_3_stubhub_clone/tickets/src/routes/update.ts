import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  handleRequestValidation,
  NotFoundError,
  NoAuthError
} from "@zeuscoder-public/microservices-course-shared";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticketUpdatedPublisher";

const router = express.Router();

const validate = [
  body("title").not().isEmpty().withMessage("Please enter a title."), // not provided and empty string
  body("price").not().isEmpty().withMessage("Please enter a price."), // not provided and empty string
  body("price").isFloat({ gt: 0 }).withMessage("Please enter a price greater than zero.") // not provided and empty string
];

router.put("/api/tickets/:id", requireAuth, validate, handleRequestValidation, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) throw new NotFoundError();

  // check that user has the right to update this ticket
  if (ticket.userId !== req.currentUser!.id) throw new NoAuthError();

  // set the update doc properties
  ticket.set({ title: req.body.title, price: req.body.price });

  // update db
  // calling .save() in mongoose also updates all references to the ticket object, so doesnt need to be refetched
  const updated = await ticket.save();

  // emit event
  new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: updated.id,
    userId: updated.userId,
    price: updated.price,
    title: updated.title
  });

  res.status(200).send(updated);
});

export { router as UpdateTicketRouter };
