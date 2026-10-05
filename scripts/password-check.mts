/** بررسی ماژول رمز — بدون نیاز به سرور. اجرا: npx tsx scripts/password-check.mts */
import { hashPassword, verifyPassword, isHashed } from "../src/lib/password";

let bad = 0;
const check = (label: string, actual: unknown, expected: unknown) => {
  const ok = actual === expected;
  if (!ok) bad++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${ok ? "" : `  (${actual} ≠ ${expected})`}`);
};

const hash = await hashPassword("Salam1404");

check("خروجی هش با scrypt$ شروع می‌شود", isHashed(hash), true);
check("رمز خام داخل هش نیست", hash.includes("Salam1404"), false);
check("رمز درست تأیید می‌شود", await verifyPassword("Salam1404", hash), true);
check("رمز غلط رد می‌شود", await verifyPassword("Salam1405", hash), false);
check("رمز خالی رد می‌شود", await verifyPassword("", hash), false);

const again = await hashPassword("Salam1404");
check("دو هش از یک رمز متفاوت‌اند (نمک تصادفی)", hash === again, false);
check("ولی هر دو همان رمز را تأیید می‌کنند", await verifyPassword("Salam1404", again), true);

// همان تحملی که قبلاً با === متن خام وجود داشت
const arabic = await hashPassword("كيميا");   // کاف و یای عربی
check("رمز عربی‌نویس با فارسی‌نویس مطابقت دارد", await verifyPassword("کیمیا", arabic), true);
const faDigits = await hashPassword("رمز۱۲۳");
check("ارقام فارسی با لاتین مطابقت دارند", await verifyPassword("رمز123", faDigits), true);

// حساب‌های قدیمی که هنوز متن خام‌اند
check("رمز خام قدیمی هنوز کار می‌کند", await verifyPassword("old-pass", "old-pass"), true);
check("رمز خام قدیمی با ورودی غلط رد می‌شود", await verifyPassword("nope", "old-pass"), false);
check("رمز خام عربی‌نویس قدیمی هم مطابقت دارد", await verifyPassword("کیمیا", "كيميا"), true);
check("متن خام به عنوان هش شناسایی نمی‌شود", isHashed("old-pass"), false);

console.log(bad === 0 ? "\nهمه‌ی بررسی‌ها موفق بود." : `\n${bad} مورد شکست خورد.`);
process.exit(bad === 0 ? 0 : 1);
