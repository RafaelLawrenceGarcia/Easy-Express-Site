import Stripe from "stripe";
import { requirePack } from "../_lib/catalog.js";
import { readRawBody, sendError } from "../_lib/http.js";
import { processVerifiedPurchase } from "../_lib/playfab.js";

export const config = { api: { bodyParser: false } };

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      const error = new Error("Payment webhooks are not configured.");
      error.statusCode = 503;
      throw error;
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const rawBody = await readRawBody(request);
    const event = stripe.webhooks.constructEvent(rawBody, request.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.payment_status === "paid") {
        const { playFabId, packId, entitlement } = session.metadata || {};
        const pack = requirePack(packId);
        if (!playFabId || entitlement !== pack.entitlement) throw new Error("Checkout metadata is invalid.");
        await processVerifiedPurchase({
          playFabId,
          packId,
          entitlement,
          orderId: session.payment_intent || session.id,
          providerEventId: event.id,
        });
      }
    }
    response.status(200).json({ received: true });
  } catch (error) {
    if (error.type === "StripeSignatureVerificationError") return response.status(400).json({ error: "Invalid webhook signature." });
    sendError(response, error);
  }
}
