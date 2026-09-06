import { getLeads } from "./leads";
import { getAllPaymentRequests } from "./paymentRequests";
import { getAllStudentBookings } from "./studentBookings";
import { LEAD_TYPE_LABEL, type LeadType } from "./leadTypes";

const BOOKING_STATUS_LABEL: Record<string, string> = {
  upcoming: "در انتظار جلسه",
  active: "فعال",
  cancelled: "لغوشده",
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: "در انتظار تایید",
  approved: "تاییدشده",
  rejected: "ردشده",
};

export interface JourneyEvent {
  at: string;
  kind: "lead" | "booking" | "payment";
  label: string;
  detail: string;
}

export interface StudentJourney {
  phone: string;
  events: JourneyEvent[];
}

function summarizeLeadData(data: Record<string, string>): string {
  return Object.entries(data)
    .filter(([key, value]) => value && key !== "phone")
    .map(([key, value]) => `${key}: ${value}`)
    .join(" · ");
}

/**
 * Stitches together every trace of one phone number across the three data
 * sources that only ever get looked at separately today (leads.json,
 * studentBookings.json, paymentRequests.json) — answers "این آدم قبلاً کجا
 * دیده شده و آخرش پول داد یا نه؟" which nothing currently computes.
 */
export async function getStudentJourney(phone: string): Promise<StudentJourney> {
  const normalized = phone.trim();
  const [leads, bookingsByPhone, payments] = await Promise.all([
    getLeads(),
    getAllStudentBookings(),
    getAllPaymentRequests(),
  ]);

  const events: JourneyEvent[] = [];

  for (const lead of leads) {
    if (lead.data.phone !== normalized) continue;
    events.push({
      at: lead.at,
      kind: "lead",
      label: LEAD_TYPE_LABEL[lead.type] ?? lead.type,
      detail: summarizeLeadData(lead.data),
    });
  }

  for (const booking of bookingsByPhone[normalized] ?? []) {
    events.push({
      at: booking.createdAt,
      kind: "booking",
      label: `رزرو: ${booking.planTitle}`,
      detail: `${booking.slot} — ${BOOKING_STATUS_LABEL[booking.status] ?? booking.status}`,
    });
  }

  for (const payment of payments.filter((p) => p.phone === normalized)) {
    events.push({
      at: payment.createdAt,
      kind: "payment",
      label: `درخواست پرداخت: ${payment.planTitle}`,
      detail: `${payment.mentorName} — ${PAYMENT_STATUS_LABEL[payment.status] ?? payment.status}`,
    });
  }

  events.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  return { phone: normalized, events };
}

export interface MultiTouchPhone {
  phone: string;
  types: LeadType[];
}

/** Phones that show up under 2+ different lead types — the people worth checking for a disconnected multi-tool history. */
export async function getMultiTouchPhones(): Promise<MultiTouchPhone[]> {
  const leads = await getLeads();
  const byPhone = new Map<string, Set<LeadType>>();

  for (const lead of leads) {
    const phone = lead.data.phone;
    if (!phone) continue;
    if (!byPhone.has(phone)) byPhone.set(phone, new Set());
    byPhone.get(phone)!.add(lead.type);
  }

  return [...byPhone.entries()]
    .filter(([, types]) => types.size >= 2)
    .map(([phone, types]) => ({ phone, types: [...types] }))
    .sort((a, b) => b.types.length - a.types.length);
}

export interface ChannelConversion {
  type: LeadType;
  leadCount: number;
  paidCount: number;
}

/**
 * For every lead type, how many distinct phones came in through it, and how
 * many of those phones ever ended up with an approved payment request —
 * the actual "which channel converts to money" answer, which today lives
 * split across leads.json (source) and paymentRequests.json (outcome) with
 * nothing joining them.
 */
export async function getConversionBySource(): Promise<ChannelConversion[]> {
  const [leads, payments] = await Promise.all([getLeads(), getAllPaymentRequests()]);
  const approvedPhones = new Set(payments.filter((p) => p.status === "approved").map((p) => p.phone));

  const byType = new Map<LeadType, Set<string>>();
  for (const lead of leads) {
    const phone = lead.data.phone;
    if (!phone) continue;
    if (!byType.has(lead.type)) byType.set(lead.type, new Set());
    byType.get(lead.type)!.add(phone);
  }

  return [...byType.entries()]
    .map(([type, phones]) => ({
      type,
      leadCount: phones.size,
      paidCount: [...phones].filter((p) => approvedPhones.has(p)).length,
    }))
    .sort((a, b) => b.leadCount - a.leadCount);
}
