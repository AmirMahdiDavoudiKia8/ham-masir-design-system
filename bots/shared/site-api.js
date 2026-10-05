// Talks to the Next.js app's internal bot API (src/app/api/bot/...) — the
// site is the source of truth for what a payment-request code means and
// whether it's been approved; the bots never touch its data files directly.
const SITE_URL = process.env.SITE_URL;
const BOT_API_SECRET = process.env.BOT_API_SECRET;

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${BOT_API_SECRET}`,
  };
}

async function getPaymentRequest(code) {
  const res = await fetch(`${SITE_URL}/api/bot/payment-requests/${encodeURIComponent(code)}`, {
    headers: headers(),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.ok ? data.request : null;
}

async function resolvePaymentRequest(code, status) {
  const res = await fetch(`${SITE_URL}/api/bot/payment-requests/${encodeURIComponent(code)}/resolve`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.ok ? data.request : null;
}

module.exports = { getPaymentRequest, resolvePaymentRequest };
