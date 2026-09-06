/** Which fields of study make sense to suggest depends entirely on which کنکور track was picked — a ریاضی student was never going into پزشکی. */
export const FIELDS_BY_TRACK: Record<string, string[]> = {
  ریاضی: [
    "مهندسی کامپیوتر",
    "مهندسی برق",
    "علوم کامپیوتر",
    "مهندسی عمران",
    "مهندسی هوافضا",
    "مهندسی صنایع",
    "مهندسی مکانیک",
  ],
  تجربی: ["پزشکی", "دندان‌پزشکی", "داروسازی"],
  انسانی: ["حقوق", "روان‌شناسی", "مدیریت"],
};
