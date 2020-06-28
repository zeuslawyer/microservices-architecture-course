import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, handleRequestValidation } from "@zeuscoder-public/microservices-course-shared";
import { Ticket } from "../models/ticket";

const validate = [
  body("title").not().isEmpty().withMessage("Please enter a title."), // not provided and empty string
  body("price").not().isEmpty().withMessage("Please enter a price."), // not provided and empty string
  body("price").isFloat({ gt: 0 }).withMessage("Please enter a price greater than zero.") // not provided and empty string
];

const router = express.Router();

router.post("/api/tickets", requireAuth, validate, handleRequestValidation, async (req: Request, res: Response) => {
  const { title, price } = req.body;

  const ticket = Ticket.build({ title, price, userId: req.currentUser!.id }); // we know currentUser will be defined at this stage, because requireAuth runs before we get this far

  await ticket.save();
  res.status(201).send(ticket);
});

export { router as createTicketRouter };
