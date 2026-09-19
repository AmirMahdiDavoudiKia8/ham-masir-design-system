/**
 * What a booking records as its "time" now that students no longer pick one.
 *
 * The booking flow used to have a time-picker screen offering vague windows
 * ("پس‌فردا صبح"…). Nobody was held to them — the team calls every student to
 * agree the real time anyway — so the screen was a click that decided
 * nothing, and the label it produced was shown back to students as if it were
 * a confirmed appointment. It's gone; this fixed label stands in for it.
 *
 * The field itself stays (bookings, payment requests, leads and the admin
 * views all carry a `slot`), so older bookings with a real picked window keep
 * displaying exactly as before. Treat this value as "not set".
 */
export const PHONE_COORDINATED_SLOT = "با تماس تلفنی هماهنگ می‌شه";
