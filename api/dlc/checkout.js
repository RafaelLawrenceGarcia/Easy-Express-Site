import Stripe from "stripe";
import { requirePack } from "../_lib/catalog.js";
import { bearerToken, sendError } from "../_lib/http.js";
import { authenticateSessionTicket, getOwnedEntitlements } from "../_lib/playfab.js";

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.SITE_URL) {
      const error = new Error("Checkout is in development mode until payment configuration is complete.");
      error.statusCode = 503;
      throw error;
    }
    const packId = request.body?.packId;
    const pack = requirePack(packId);
    const priceId = process.env[pack.priceEnv];
    if (!priceId) {
      const error = new Error("This DLC pack is not available for checkout yet.");
      error.statusCode = 503;
      throw error;
    }
    const playFabId = await authenticateSessionTicket(bearerToken(request));
    const owned = await getOwnedEntitlements(playFabId);
    if (owned.includes(pack.entitlement)) return response.status(409).json({ error: "This DLC pack is already owned." });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const siteUrl = process.env.SITE_URL.replace(/\/$/, "");
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/?purchase=pending&pack=${encodeURIComponent(packId)}#dlc-store`,
      cancel_url: `${siteUrl}/?purchase=cancelled&pack=${encodeURIComponent(packId)}#dlc-store`,
      client_reference_id: playFabId,
      metadata: { playFabId, packId, entitlement: pack.entitlement },
    }, { idempotencyKey: `checkout:${playFabId}:${packId}:${Date.now()}` });
    response.status(200).json({ checkoutUrl: session.url });
  } catch (error) {
    sendError(response, error);
  }
}
