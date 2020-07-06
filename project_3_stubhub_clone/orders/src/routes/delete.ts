import express, { Request, Response } from "express";

const router = express.Router();

router.delete("/api/orders/:orderId", async (req: Request, res: Response) => {
  res.send(`OK, ${req.params.orderId}`);
});

export { router as deleteOrderRouter };
