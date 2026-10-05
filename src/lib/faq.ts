/**
 * The questions a student actually arrives with, answered in the site's own
 * voice. Single source for BOTH the visible FAQ section on the home page and
 * the FAQPage JSON-LD — the two must never diverge.
 *
 * They diverged before: the schema shipped with five Q&As that appeared
 * nowhere in the rendered page, which is exactly the "markup that doesn't
 * match visible content" Google's structured-data policy prohibits. Reading
 * both off this one array makes that drift structurally impossible instead of
 * a promise in a comment.
 *
 * Answers are written to stand alone. Someone (or an AI answer engine)
 * quoting a single entry out of context should still get a true, complete
 * answer — no "as mentioned above", no dangling pronouns.
 */
export interface FaqEntry {
  question: string;
  answer: string;
}

export const HOME_FAQ: FaqEntry[] = [
  {
    question: "هزینه رو کی باید پرداخت کنم؟",
    answer:
      "برای رزرو جلسه هیچ پولی گرفته نمی‌شه. اول جلسه برگزار می‌شه، بعدش اگه راضی بودی حساب می‌کنی. اگه راضی نبودی، هیچی بدهکار نیستی و ارائه‌ی دلیل هم لازم نیست.",
  },
  {
    question: "هم‌مسیرها کی هستن؟",
    answer:
      "دانشجوهایی که خودشون یک‌دو سال پیش کنکور دادن و حالا در بهترین دانشگاه‌های کشور درس می‌خونن. هویت و سوابق تحصیلی هر هم‌مسیر پیش از پذیرش بررسی و تایید می‌شه.",
  },
  {
    question: "طرح‌ها چیه و چه فرقی دارن؟",
    answer:
      "طرح راه‌نما: یک جلسه‌ی ۴۵ دقیقه‌ای در گوگل‌میت برای هر سؤالی درباره‌ی منابع، برنامه یا انتخاب رشته. طرح بادیگارد: ۴ جلسه‌ی ۴۵ دقیقه‌ای در ماه به‌همراه برنامه‌ریزی شخصی‌سازی‌شده و پیگیری مستمر پیشرفت.",
  },
  {
    question: "چطور هم‌مسیرم رو انتخاب کنم؟",
    answer:
      "با پاسخ دادن به چند سؤال کوتاه و چهارگزینه‌ای، لیستی از هم‌مسیرهایی که تجربه‌ی مشابهی با تو داشتن رو می‌بینی و خودت از بینشون انتخاب می‌کنی.",
  },
  {
    question: "جلسه‌ها کجا برگزار می‌شه؟",
    answer:
      "جلسه‌ها آنلاین و در گوگل‌میت برگزار می‌شن. بعد از ثبت رزرو، برای هماهنگی تایم دقیق باهات تماس گرفته می‌شه.",
  },
];

/** FAQPage JSON-LD built from the same entries the page renders — never hand-written separately. */
export function buildFaqJsonLd(entries: FaqEntry[] = HOME_FAQ) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
