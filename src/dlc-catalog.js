export const DLC_CATALOG = [
  {
    packId: "dlc_neon_diagnostics",
    entitlement: "DLC_NEON_DIAGNOSTICS",
    name: "Neon Diagnostics Pack",
    price: "₱169.00 PHP",
    accent: "#00e5ff",
    tagline: "Professional high-tech repair lab",
    description: "Build a sharper diagnostic bay with neon instrumentation and technician-ready displays.",
    benefit: "Four small ambience bonuses (0.45-0.75 each) through the existing furniture reputation cap.",
    items: ["Neon Diagnostic Wall Panel", "Circuit Diagnostics Wall Display", "Multi-Monitor Repair Display", "Technician Status Terminal"],
  },
  {
    packId: "dlc_customer_lounge",
    entitlement: "DLC_CUSTOMER_LOUNGE",
    name: "Customer Lounge Pack",
    price: "₱199.00 PHP",
    accent: "#00e676",
    tagline: "Comfort and customer trust",
    description: "Create a welcoming waiting area that communicates care, comfort, and confidence.",
    benefit: "Four modest ambience bonuses (0.45-1.00 each) through the existing furniture reputation cap.",
    items: ["Premium Waiting Couch", "Guest Refreshment Shelf", "Indoor Plant Arrangement", "Customer Information Display"],
  },
  {
    packId: "dlc_showroom_pro",
    entitlement: "DLC_SHOWROOM_PRO",
    name: "Showroom Pro Pack",
    price: "₱229.00 PHP",
    accent: "#7c4dff",
    tagline: "Premium PC retail presentation",
    description: "Give components and finished builds a polished showroom presentation without replacing normal progression.",
    benefit: "Four modest ambience bonuses (0.60-1.00 each) through the existing furniture reputation cap.",
    items: ["Glass Hardware Display Cabinet", "Premium Component Retail Shelf", "Curved Showcase Monitor", "Showroom Brand Wall"],
  },
];

export function findDlcPack(packId) {
  return DLC_CATALOG.find((pack) => pack.packId === packId);
}
