import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  handleRequestValidation,
  BadRequestError,
  NotFoundError,
} from "@zeuscoder-public/microservices-course-shared";

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
    res.send("SUCCESS");
  }
);

export { router as CreateChargeRouter };
