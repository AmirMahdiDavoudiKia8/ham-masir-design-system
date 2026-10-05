/*
 * Service worker for the founder's notifications (see src/lib/adminNotify.ts).
 *
 * Registered with scope /mentor/admin/ on purpose: the site root already has
 * Kavenegar's worker (/kvn-push-sw.js, scope "/"), and a second worker at the
 * same scope would silently replace it and break Kavenegar's visitor push.
 * Living under /mentor/admin/ gives this one its own scope and its own push
 * subscription, independent of that one.
 */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "هم‌مسیر", body: event.data ? event.data.text() : "" };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "هم‌مسیر", {
      body: data.body || "",
      icon: "/brand/logo.png",
      badge: "/brand/logo.png",
      dir: "rtl",
      lang: "fa",
      data: { url: data.url || "/mentor/admin/leads" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/mentor/admin/leads", self.location.origin).href;
  event.waitUntil(
    (async () => {
      const open = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const existing = open.find((c) => c.url.startsWith(self.location.origin + "/mentor/admin"));
      if (existing) {
        await existing.navigate(url).catch(() => {});
        return existing.focus();
      }
      return self.clients.openWindow(url);
    })(),
  );
});
