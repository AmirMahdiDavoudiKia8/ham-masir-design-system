const VISITOR_ID_KEY = "hammasir_visitor_id";

/** Random, anonymous, device-local — not tied to phone/name/any real identity. Only used to approximate "unique visitors" in the self-hosted dashboard. */
function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return "unknown";
  }
}

function send(type: "pageview" | "click", path: string, label?: string): void {
  try {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, path, label, visitorId: getVisitorId() }),
    }).catch(() => {});
  } catch {
    // Best-effort only.
  }
}

export function trackPageview(path: string): void {
  send("pageview", path);
}

/** Call from a button's onClick for anything worth a click-through rate — pass a short stable label (e.g. "payment_submit"), not free text. */
export function trackClick(path: string, label: string): void {
  send("click", path, label);
}
