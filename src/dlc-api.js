const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

async function request(path, sessionTicket, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(sessionTicket ? { Authorization: `Bearer ${sessionTicket}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "The DLC service is unavailable.");
  return data;
}

export function getOwnedDlc(sessionTicket) {
  return request("/api/dlc/owned", sessionTicket);
}

export function createDlcCheckout(sessionTicket, packId) {
  return request("/api/dlc/checkout", sessionTicket, {
    method: "POST",
    body: JSON.stringify({ packId }),
  });
}
