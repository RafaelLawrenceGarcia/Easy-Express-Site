export const SERVER_DLC_CATALOG = Object.freeze({
  dlc_neon_diagnostics: {
    entitlement: "DLC_NEON_DIAGNOSTICS",
    priceEnv: "STRIPE_PRICE_DLC_NEON_DIAGNOSTICS",
  },
  dlc_customer_lounge: {
    entitlement: "DLC_CUSTOMER_LOUNGE",
    priceEnv: "STRIPE_PRICE_DLC_CUSTOMER_LOUNGE",
  },
  dlc_showroom_pro: {
    entitlement: "DLC_SHOWROOM_PRO",
    priceEnv: "STRIPE_PRICE_DLC_SHOWROOM_PRO",
  },
});

export function requirePack(packId) {
  const pack = SERVER_DLC_CATALOG[packId];
  if (!pack) throw new Error("Unknown DLC pack.");
  return pack;
}
