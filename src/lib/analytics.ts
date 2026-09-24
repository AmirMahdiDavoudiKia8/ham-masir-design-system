import { appendText, listFileNames, readText } from "@/lib/storage";

export type AnalyticsEventType = "pageview" | "click";

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  path: string;
  label?: string;
  visitorId?: string;
  ts: string;
}

const DIR = "src/data/analytics";

function fileForDate(date: Date): string {
  const day = date.toISOString().slice(0, 10);
  return `${DIR}/${day}.jsonl`;
}

/**
 * Self-hosted pageview/click log — one line of JSON per event, appended to a
 * per-day file (src/data/analytics/YYYY-MM-DD.jsonl) so no single file grows
 * without bound and reading "last N days" only touches N small files. Picked
 * over Google Analytics because GA's collector is unreliably filtered for a
 * meaningful share of visitors in Iran, which would silently undercount
 * exactly the traffic this site cares about.
 */
export async function recordEvent(event: Omit<AnalyticsEvent, "ts">): Promise<void> {
  const full: AnalyticsEvent = { ...event, ts: new Date().toISOString() };
  await appendText(fileForDate(new Date()), `${JSON.stringify(full)}\n`);
}

async function readDay(date: Date): Promise<AnalyticsEvent[]> {
  const raw = await readText(fileForDate(date), "");
  return raw
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as AnalyticsEvent;
      } catch {
        return null;
      }
    })
    .filter((e): e is AnalyticsEvent => e !== null);
}

export interface DaySummary {
  date: string;
  pageviews: number;
  uniqueVisitors: number;
}

export interface AnalyticsSummary {
  totalPageviews: number;
  uniqueVisitors: number;
  topPaths: { path: string; count: number }[];
  clicksByLabel: { label: string; count: number }[];
  byDay: DaySummary[];
  /** Pre-matched view/click pairs for the funnels worth a click-through rate — computed during aggregation (not from the truncated topPaths list) so long-tail paths like per-mentor payment pages still count fully. */
  funnels: {
    mentorListViews: number;
    mentorCardClicks: number;
    paymentPageViews: number;
    paymentSubmitClicks: number;
  };
}

/** Aggregates the last `days` days of events (today inclusive) for the admin dashboard. */
export async function getAnalyticsSummary(days: number): Promise<AnalyticsSummary> {
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  });

  const perDayEvents = await Promise.all(dates.map(readDay));

  const allVisitors = new Set<string>();
  const pathCounts = new Map<string, number>();
  const labelCounts = new Map<string, number>();
  let totalPageviews = 0;
  let mentorListViews = 0;
  let paymentPageViews = 0;
  const byDay: DaySummary[] = [];

  perDayEvents.forEach((events, i) => {
    const dayVisitors = new Set<string>();
    let dayPageviews = 0;

    for (const e of events) {
      if (e.visitorId) allVisitors.add(e.visitorId);
      if (e.type === "pageview") {
        totalPageviews += 1;
        dayPageviews += 1;
        if (e.visitorId) dayVisitors.add(e.visitorId);
        pathCounts.set(e.path, (pathCounts.get(e.path) ?? 0) + 1);
        if (e.path.startsWith("/student/mentors") || e.path.startsWith("/student/discover")) mentorListViews += 1;
        if (e.path.includes("/payment")) paymentPageViews += 1;
      } else if (e.type === "click" && e.label) {
        labelCounts.set(e.label, (labelCounts.get(e.label) ?? 0) + 1);
      }
    }

    byDay.push({
      date: dates[i].toISOString().slice(0, 10),
      pageviews: dayPageviews,
      uniqueVisitors: dayVisitors.size,
    });
  });

  return {
    totalPageviews,
    uniqueVisitors: allVisitors.size,
    topPaths: [...pathCounts.entries()]
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15),
    clicksByLabel: [...labelCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    // byDay is already pushed newest-first (dates[0] is today) — exactly
    // what the admin dashboard wants when it does byDay.slice(0, 14) for
    // "last 14 days". Reversing here used to silently hand that slice the
    // 14 *oldest* days in the window instead, which stayed invisible until
    // the site had enough history for the newest days to actually differ
    // from zero.
    byDay,
    funnels: {
      mentorListViews,
      mentorCardClicks: labelCounts.get("mentor_card") ?? 0,
      paymentPageViews,
      paymentSubmitClicks: labelCounts.get("payment_submit") ?? 0,
    },
  };
}

/** Lists which day-files exist, purely so the dashboard can say "no data yet" accurately instead of guessing from an empty summary. */
export async function hasAnyAnalyticsData(): Promise<boolean> {
  return (await listFileNames(DIR)).some((f) => f.endsWith(".jsonl"));
}
