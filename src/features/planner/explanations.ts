import { toPersianDigits } from "@/lib/format";
import type { Phase, SubjectAllocation } from "./types";

/**
 * Per-subject explanation text, computed dynamically instead of a static
 * per-reasonTag string. Fixes a real accuracy bug: the old static copy for
 * "weakHighWeight" claimed "بیشترین وقت رو بهش دادیم" (we gave it the MOST
 * time) for every subject carrying that tag — but when two subjects both
 * carry it (e.g. ریاضی at 15h and فیزیک at 11.5h), only one of them can
 * honestly be "the most". Only the actual top subject by weeklyHours gets
 * that claim; the rest get "سهم بزرگی از وقتت" (a large share) instead. Also
 * folds in the subject's real gap/current numbers so the same tag doesn't
 * read as identical canned copy across different subjects.
 */
export function explainAllocation(allocation: SubjectAllocation, allAllocations: SubjectAllocation[]): string {
  const gap = Math.round(allocation.gapToTarget);
  const isTopByHours = allAllocations.every((a) => a.subjectKey === allocation.subjectKey || a.weeklyHours <= allocation.weeklyHours);

  switch (allocation.reasonTag) {
    case "weakHighWeight":
      return isTopByHours
        ? `چون ضریبش بالاست و ${toPersianDigits(gap)}٪ تا هدفت فاصله داری، بیشترین وقتت رو بهش اختصاص دادیم.`
        : `چون ضریبش بالاست و ${toPersianDigits(gap)}٪ تا هدفت فاصله داری، سهم بزرگی از وقتت بهش رسید.`;
    case "onTrack":
      if (gap <= 0) return "از درصد هدفت جلوتری — همین روند رو حفظ کن.";
      // "فقط" (just/only) reads honest for a small gap but undersells a real
      // double-digit one — only use it below 10%.
      return gap <= 10
        ? `فقط ${toPersianDigits(gap)}٪ تا هدفت فاصله داری — رو مسیر خوبی هستی.`
        : `${toPersianDigits(gap)}٪ تا هدفت فاصله داری — رو مسیر خوبی هستی، همین‌طور ادامه بده.`;
    case "strongMaintain":
      return `نقطه‌ی قوتته — الان ${toPersianDigits(Math.round(allocation.currentPercent))}٪ می‌زنی، با وقت کمتر می‌تونی نگه‌ش داری.`;
  }
}

/** What to actually spend time on during each phase — shown under the "فاز فعلی" stat so the label isn't just a name with no meaning attached. */
export const PHASE_EXPLANATION: Record<Phase, string> = {
  paye: "توی این فاز، تمرکز اصلی روی یادگیری کامل مطالبه، نه سرعت — محکم و قدم‌به‌قدم برو جلو.",
  taghviat: "مطالب پایه رو بلدی؛ حالا وقتشه با تست بیشتر، جاهای ضعیف رو محکم‌تر کنی.",
  jamBandiZoodras: "کم‌کم داری به آزمون نزدیک می‌شی — نسبت تست به مطالعه رو بیشتر کن و مرور رو جدی بگیر.",
  jamBandiNahaei: "این آخرین فرصته برای مرور و تست — مطلب جدید یاد نگیر، فقط چیزی که بلدی رو محکم کن.",
};

/**
 * 10 narrative bands over `overallLevelPercent` (the average currentPercent
 * across all of a student's subjects — see engine.ts's computeOverallStats)
 * — a "کجای مسیر ایستادی؟" framing paragraph shown once
 * near the top of the result, distinct from the per-subject/phase copy
 * elsewhere. `max` is the band's upper bound (inclusive); bands are checked
 * in order, so the first one the score fits under wins. `scienceText` pairs
 * each band with a real, established learning-science finding (power law of
 * practice, testing effect, spacing effect, etc.) matched to that stage —
 * not a fabricated citation, just named research areas — to back the advice
 * with something more concrete than motivational copy.
 */
const LEVEL_NARRATIVE_BANDS: { max: number; text: string; scienceText: string }[] = [
  {
    max: 10,
    text: "الان توی نقطه‌ی شروعی — و این یعنی بیشترین فضای رشد رو داری. هر ساعتی که می‌ذاری، تاثیرش رو زود می‌بینی.",
    scienceText: "طبق «قانون توان یادگیری» (Power Law of Practice)، بیشترین جهش‌ها همیشه توی روزهای اول اتفاق می‌افته — چون هنوز چیز آماده‌ی برداشتن زیاده. اما همین تحقیق می‌گه این سرعت طبیعتاً کم می‌شه؛ ثبات همون چیزیه که از اینجا به بعد باید بسازی.",
  },
  {
    max: 20,
    text: "پایه‌ت هنوز شکل نگرفته، ولی این طبیعیه. با یه برنامه‌ی منظم، خیلی زود حس فرق رو می‌کنی.",
    scienceText: "تحقیقات روی «اثر بازیابی» (Testing Effect - رودیگر و کارپیک) نشون داده تست‌زدن حتی وقتی هنوز ضعیفی، مغزت رو بیشتر از خوندن صرف تقویت می‌کنه. از همین الان تست کار کن، نه فقط جزوه‌خونی.",
  },
  {
    max: 30,
    text: "یه پایه‌ی کوچیک داری که می‌شه روش ساخت. الان وقتشه مباحث رو یکی‌یکی محکم کنی.",
    scienceText: "منحنی فراموشی ابینگهاوس نشون می‌ده بدون مرور، بیشتر یادگرفته‌ها ظرف چند روز از یاد می‌ره. مرور فاصله‌دار (Spacing Effect) دقیقاً همینجا بیشترین تاثیر رو داره — چون پایه‌ت هنوز شکننده‌ست.",
  },
  {
    max: 40,
    text: "داری از صفر فاصله می‌گیری. تمرکز روی تست‌های پایه کمکت می‌کنه سرعت بگیری.",
    scienceText: "پژوهش‌های یادگیری تعاملی (Interleaved Practice - روهرر و تیلور) نشون می‌ده تمرین مخلوط چند مبحث با هم، به‌جای پشت‌سرهم یکی‌یکی، حافظه‌ی بلندمدت رو خیلی قوی‌تر می‌کنه. الان بهترین زمانه که این عادت رو بسازی.",
  },
  {
    max: 50,
    text: "دقیقاً وسط راهی — نیمی از مسیر رو رفتی، نیمی مونده. با همین روند ادامه بده.",
    scienceText: "خیلی از پژوهش‌های یادگیریِ مهارت (مثل تایپ یا شطرنج) یه «فلات» دقیقاً همین‌جای مسیر رو نشون می‌دن — جایی که پیشرفت کندتر به‌نظر می‌رسه ولی واقعاً متوقف نشده. رد شدن از این فلات فقط با تداوم ممکنه.",
  },
  {
    max: 60,
    text: "از نصف راه گذشتی و این خودش یه موفقیته. الان وقتِ عمیق‌تر شدنه، نه فقط جلو رفتن.",
    scienceText: "نظریه‌ی خودتنظیمی یادگیری (زیمرمن) می‌گه از این سطح به بعد، پیشرفت بیشتر به «رصد کردن خودت» وابسته‌ست تا به حجم مطالعه — یعنی وقتشه بفهمی دقیقاً کجاها می‌بازی، نه فقط بیشتر بخونی.",
  },
  {
    max: 70,
    text: "سطحت خوبه — بیشتر دانش‌آموزا به اینجا نمی‌رسن. حالا باید روی نکته‌های ریز و تله‌های امتحان کار کنی.",
    scienceText: "طبق نظریه‌ی «تمرین هدفمند» اریکسون (Deliberate Practice)، از یه سطحی به بعد تمرین تکراری دیگه فایده نداره — فقط تمرکز دقیق روی نقطه‌ضعف‌های مشخص جواب می‌ده. الان دقیقاً همون سطحی.",
  },
  {
    max: 80,
    text: "جزو کسایی هستی که پایه‌ی قوی ساختن. تمرکزت رو بذار روی تست‌های سخت‌تر و مدیریت زمان.",
    scienceText: "پدیده‌ی «حافظه‌ی وابسته به بافت» (تولوینگ) نشون می‌ده مغز بهتر یاد می‌گیره وقتی شرایط تمرین شبیه شرایط امتحانه. تمرین زمان‌دار و شبیه‌سازی‌شده از الان، دقیقاً برای همینه.",
  },
  {
    max: 90,
    text: "سطحت عالیه — فاصله‌ت تا نهایت‌شدن کمه. الان دقت و سرعت مهم‌تره تا یادگیری مطلب جدید.",
    scienceText: "تحقیقات حافظه‌ی کاری (نظریه‌ی بار شناختی - سوئلر) می‌گن وقتی یه مهارت خودکار (Automatic) بشه، ذهن دیگه برای «حل‌کردن» انرژی نمی‌ذاره و می‌تونه سریع‌تر و دقیق‌تر عمل کنه. تمرین بیشتر الان دقت رو بالا می‌بره، نه دانش رو.",
  },
  {
    max: 100,
    text: "توی بالاترین سطحی. کارت فقط حفظ همین سطح با تست‌های ترکیبی و دوره‌ست.",
    scienceText: "متاآنالیزهای بزرگ روی مرور فاصله‌دار (Cepeda و همکاران) نشون دادن حتی بالاترین سطح تسلط هم بدون مرور دوره‌ای افت می‌کنه. نگه‌داشتن این سطح فقط با تست ترکیبی و مرور منظمه، نه یادگیری جدید.",
  },
];

function findLevelBand(overallLevelPercent: number) {
  const clamped = Math.min(100, Math.max(0, overallLevelPercent));
  return LEVEL_NARRATIVE_BANDS.find((b) => clamped <= b.max) ?? LEVEL_NARRATIVE_BANDS[LEVEL_NARRATIVE_BANDS.length - 1];
}

export function getLevelNarrative(overallLevelPercent: number): string {
  return findLevelBand(overallLevelPercent).text;
}

export function getLevelScienceText(overallLevelPercent: number): string {
  return findLevelBand(overallLevelPercent).scienceText;
}

export interface StrengthWeaknessSummary {
  strengths: SubjectAllocation[];
  growthAreas: SubjectAllocation[];
}

/**
 * Picks up to 2 strengths (smallest gapToTarget — closest to or past their
 * own goal) and up to 2 growth areas (largest gapToTarget), for a scannable
 * summary distinct from the full table. With fewer than 4 subjects (ریاضی
 * track: 3), slots shrink to 1+1 rather than padding with a meaningless
 * middle pick.
 */
export function buildStrengthWeaknessSummary(allocations: SubjectAllocation[]): StrengthWeaknessSummary {
  const sorted = [...allocations].sort((a, b) => a.gapToTarget - b.gapToTarget);
  const slots = Math.min(2, Math.floor(sorted.length / 2));
  return {
    strengths: sorted.slice(0, slots),
    growthAreas: sorted.slice(sorted.length - slots).reverse(),
  };
}

/**
 * A qualitative, non-overpromising read on whether the current pace can
 * close the gap by exam day — deliberately avoids inventing a fake-precise
 * "you'll reach X%" number (nothing in the engine's model is validated
 * against real outcomes closely enough to justify that), banding instead on
 * the phase (is there still runway?) and overallGapPercent (how much ground
 * is there to cover).
 */
export function getTrendProjection(phase: Phase, overallGapPercent: number): string {
  if (phase === "jamBandiNahaei") {
    return "با روزهای باقی‌مونده، دیگه وقتِ جبران کامل فاصله‌ها نیست — ولی تمرکز روی درس‌های اولویت‌دار همین الان بیشترین تاثیر رو داره.";
  }
  if (overallGapPercent <= 10) {
    return "فاصله‌ت تا هدف کمه — با ثبات روی همین برنامه، به‌راحتی بهش می‌رسی.";
  }
  if (overallGapPercent <= 25) {
    return "با همین روند و افزایش تدریجی ساعت مطالعه‌ت طبق نمودار بالا، تا کنکور می‌تونی فاصله‌ت رو تا حد زیادی ببندی.";
  }
  return "فاصله‌ت زیاده، ولی وقت کافی داری — اگه طبق منحنی افزایش ساعت مطالعه پیش بری، رسیدن به هدفت واقعاً ممکنه.";
}
