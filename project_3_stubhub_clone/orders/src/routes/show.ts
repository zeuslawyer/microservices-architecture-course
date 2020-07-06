import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/orders/:orderId", async (req: Request, res: Response) => {
  res.send(`OK, ${req.params.orderId}`);
});

router.get("/api/orders", async (req: Request, res: Response) => {
  res.send("OK");
});

export { router as showOrderRouter };
