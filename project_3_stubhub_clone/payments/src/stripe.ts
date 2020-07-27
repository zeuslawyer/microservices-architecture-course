import Stripe from "stripe";

const secret = process.env.STRIPE_KEY!;
export const stripe = new Stripe(secret, { apiVersion: "2020-03-02" });
