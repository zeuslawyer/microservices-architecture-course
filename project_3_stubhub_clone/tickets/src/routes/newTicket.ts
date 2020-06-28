import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, handleRequestValidation } from "@zeuscoder-public/microservices-course-shared";

const validate = [
  body("title").not().isEmpty().withMessage("Please enter a title."), // not provided and empty string
  body("price").not().isEmpty().withMessage("Please enter a price."), // not provided and empty string
  body("price").isFloat({ gt: 0 }).withMessage("Please enter a price greater than zero.") // not provided and empty string
];

const router = express.Router();

router.post("/api/tickets", requireAuth, validate, handleRequestValidation, (req: Request, res: Response) => {
  res.sendStatus(200);
});

export { router as createTicketRouter };
