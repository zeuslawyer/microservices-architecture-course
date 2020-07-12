import express, { Request, Response } from "express";
import { requireAuth, handleRequestValidation } from "@zeuscoder-public/microservices-course-shared";
import { body } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

const validation = [
  body("ticketId")
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // is valid mongoose id.  but causes coupling between db and orders service
];
router.post("/api/orders", requireAuth, validation, handleRequestValidation, async (req: Request, res: Response) => {});

export { router as createOrderRouter };
