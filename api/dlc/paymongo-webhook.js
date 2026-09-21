import { requirePack } from "../_lib/catalog.js";
import { readRawBody, sendError } from "../_lib/http.js";
import { parseCheckoutReference, verifyPayMongoSignature } from "../_lib/paymongo.js";
import { getPendingDlcCheckout, processVerifiedPurchase, savePendingDlcCheckout } from "../_lib/playfab.js";

export const config = { api: { bodyParser: false } };

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  try {
    const rawBody = await readRawBody(request);
    if (!verifyPayMongoSignature(rawBody, request.headers["paymongo-signature"])) {
      return response.status(400).json({ error: "Invalid webhook signature." });
    }

    const event = JSON.parse(rawBody.toString("utf8"));
    if (event?.data?.attributes?.type === "checkout_session.payment.paid") {
      const checkout = event.data.attributes.data;
      const parsedReference = parseCheckoutReference(checkout?.attributes?.reference_number);
      if (!parsedReference) throw new Error("Checkout reference is invalid.");

      const pending = await getPendingDlcCheckout(parsedReference.playFabId, parsedReference.orderId);
      if (!pending || pending.status === "completed") {
        return response.status(200).json({ received: true, duplicate: pending?.status === "completed" });
      }
      const pack = requirePack(pending.packId);
      if (
        pending.entitlement !== pack.entitlement
        || pending.amount !== pack.amount
        || pending.currency !== pack.currency
        || pending.checkoutSessionId !== checkout.id
      ) throw new Error("Checkout verification failed.");

      await processVerifiedPurchase({
        playFabId: parsedReference.playFabId,
        packId: pending.packId,
        entitlement: pending.entitlement,
        orderId: checkout.id,
        providerEventId: event.data.id,
      });
      await savePendingDlcCheckout(parsedReference.playFabId, parsedReference.orderId, {
        ...pending,
        status: "completed",
        providerEventId: event.data.id,
        completedAt: new Date().toISOString(),
      });
    }
    response.status(200).json({ received: true });
  } catch (error) {
    sendError(response, error);
  }
}
