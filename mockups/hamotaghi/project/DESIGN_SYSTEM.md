# دیزاین سیستم «هم‌اتاقی»

مرجع مشترک UI برای هر دو توسعه‌دهنده فرانت‌اند (Next.js + React + MUI، بدون Tailwind).
هدف: هر صفحه‌ای که هر کدام از ما می‌سازیم، دقیقاً همان رنگ، فونت، اندازه و فاصله‌ها را داشته باشد.

صفحه زنده همه توکن‌ها و کامپوننت‌ها: `npm run dev` و بعد **http://localhost:3000/design-system**

---

## ۱. قانون طلایی

> **هیچ مقدار بصری (رنگ، فونت، اندازه/وزن فونت، سایه، گردی) خارج از `src/design-system/` نوشته نمی‌شود.**

این قرارداد واقعاً اجرا می‌شود، نه فقط مستند می‌شود. ESLint روی `src/**` (به‌جز `src/design-system/**`) این موارد را error می‌دهد:

| دسته | نمونه ممنوع | جایگزین |
|---|---|---|
| رنگ | `color: '#1D4ED8'` یا `rgba(...)` | `color: 'primary.main'` / `statusText.error` |
| خانواده فونت | `fontFamily: '...'` | `<Typography variant="...">` |
| اندازه فونت | `fontSize: 14` | `<Typography variant="body1">` یا `typography: 'body1'` |
| وزن فونت | `fontWeight: 600` | `fontWeight: 'fontWeightBold'` |
| ارتفاع خط | `lineHeight: 1.5` | variant تایپوگرافی |
| گردی | `borderRadius: 12` یا `'12px'` | `(t) => \`${t.radius.md}px\`` |
| سایه | `boxShadow: '0 2px 4px …'` | `boxShadow: 1` / `3` / `8` |

**اندازه‌های ثابت** (آواتار، آیکون، بج، فریم موبایل) در `tokens.size` هستند. اندازه‌های چیدمان با `theme.spacing` نوشته می‌شوند؛ برای `height`/`width` از تابع استفاده کنید تا اشتباهی به پیکسل خام تبدیل نشود: `height: (t) => t.spacing(9)` یعنی ۷۲px. این دو دسته با بازبینی PR کنترل می‌شوند، چون هر عدد چیدمانی لزوماً یک مقدار طراحی نیست.

اگر چیزی در دیزاین سیستم نیست، اول آن را به دیزاین سیستم اضافه کنید (با PR جدا)، بعد استفاده کنید:

1. مقدار خام را در `tokens.ts` تعریف کنید.
2. اگر نقش معنایی است، آن را در `theme.ts` به تم وصل کنید.
3. در صفحه فقط از تم/توکن استفاده کنید.
4. `npm run lint` و `npm run typecheck` را اجرا کنید.

| ❌ ممنوع | ✅ درست |
|---|---|
| `{score}٪` با عدد خام | `{faDigits(score)}٪` |
| `marginLeft` / `paddingRight` | `ms` / `me` / `ps` / `pe` یا `marginInlineStart` |
| `import … from '@/design-system/components/X'` | `import { X } from '@/design-system'` |
| متن وضعیت با `success.main` | `statusText.success` (AA) |
| حلقه/آیکون وضعیت با `success.main` | `statusStroke.success` (۳:۱) |

---

## ۲. ساختار

```
src/design-system/
├── tokens.ts                 ← تنها منبع همه مقادیر (رنگ، تایپ، فاصله، …)
├── theme.ts                  ← تم MUI که از توکن‌ها ساخته می‌شود + استایل پیش‌فرض کامپوننت‌ها
├── DesignSystemProvider.tsx  ← RTL + تم + CssBaseline (فقط یک بار در layout)
├── digits.ts                 ← faDigits / enDigits برای اعداد فارسی
├── components/               ← کامپوننت‌های مشترک
└── index.ts                  ← تنها نقطه import
```

---

## ۳. توکن‌ها

### رنگ — فقط نقش‌های معنایی

مقادیر از بورد فیگمای دیزاینر («توکن‌های طراحی سامانه تطبیق هم‌اتاقی») گرفته شده‌اند.

| نقش MUI | توکن فیگما | مقدار | کاربرد |
|---|---|---|---|
| `primary` | `--primary-700` | `#1D4ED8` | رنگ برند، فیلد فوکوس‌شده، دایره فعال OTP، لینک، **دکمه اصلی پنل مدیر** |
| `primary.light` / `.dark` | `--primary-500` / `--primary-900` | `#3B82F6` / `#1E3A8A` | آیکون فعال / هدر و پنل تیره |
| `secondary` | `--complement-500` | `#F59E0B` | **دکمه CTA اصلی صفحات دانشجو**، تاگل، حالت فعال (متن تیره روی آن) |
| `secondary.dark` | `--complement-600` | `#D97706` | هاور/فشرده CTA |
| `success` | `--semantic-success` / `-bg` | `#10B981` / `#ECFDF5` | تأیید، سازگاری بالا (≥۷۵) — فقط پس‌زمینه/گرافیک |
| `warning` | `--complement-600` / `-50` | `#D97706` / `#FEF3C7` | در انتظار، «تفاوت قابل مدیریت»، سازگاری متوسط |
| `error` | `--semantic-error` / `-bg` | `#EF4444` / `#FEF2F2` | خطا، «خط قرمز»، سازگاری پایین، حذف — فقط پس‌زمینه/گرافیک |
| `info` | `--semantic-info` | `#3B82F6` | نکات راهنما و اعلان‌ها |
| `statusText.success` | نسخه تیره‌ی success | `#047857` | متن سبز (AA روی سفید و `success.light`) |
| `statusText.warning` | نسخه تیره‌ی warning | `#92400E` | متن هشدار (AA) |
| `statusText.error` | نسخه تیره‌ی error | `#B91C1C` | متن خطا (AA) |
| `statusText.info` | `--primary-700` | `#1D4ED8` | متن اطلاع‌رسانی (AA) |
| `statusStroke.*` | نسخه‌ی ۶۰۰ رنگ‌ها | `#059669` / `#D97706` / `#DC2626` / `#3B82F6` | حلقه، آیکون و بوردر وضعیت (حداقل ۳:۱) |
| `brand.tint` / `brand.soft` | `--primary-50` / `--primary-200` | `#EFF6FF` / `#DBEAFE` | کارت خوش‌آمدگویی و هاله‌ی آیکون |
| `text.primary` | `--text-primary` | `#0F172A` | تیترها، اعداد OTP، متن ورودی |
| `text.secondary` | `--text-secondary` | `#475569` | زیرتیتر، توضیح، لینک ادمین |
| `background.default` | `--surface-canvas` | `#F8FAFC` | پس‌زمینه صفحه |
| `background.paper` | `--surface-card` | `#FFFFFF` | کارت‌ها و ورودی‌ها |
| `background.subtle` | `--surface-muted` | `#F1F5F9` | کانتینر تاگل، دکمه ادمین |
| `divider` / `tokens.color.border` | `--border-default` | `#E2E8F0` / `#CBD5E1` | خط جداکننده / دور فیلدها و دایره‌های OTP |

**قانون دکمه‌ها:** در صفحات دانشجو، اکشن اصلی `variant="contained" color="secondary"` (کهربایی) است. در پنل مدیر، `color="primary"` (آبی). سایه رنگی زیر دکمه‌ها خودکار از تم می‌آید.

### تایپوگرافی — فونت استعداد (Estedad)

فونت از پکیج `@fontsource-variable/estedad` لود می‌شود (self-hosted، بدون درخواست به گوگل). ۷ سبک دقیقاً طبق فیگما، در همه اندازه‌های صفحه **ثابت**:

| سبک فیگما | variant | اندازه / ارتفاع خط | وزن | کاربرد |
|---|---|---|---|---|
| Display / H1 | `h1` (و `display`) | 24 / 36 | 800 | **عنوان صفحه** (از طریق `PageHeader`)، عدد StatCard |
| Heading 2 | `h2` | 19 / 30 | 700 | عنوان بخش |
| Title / Nav Header | `h3` | 16 / 26 | 700 | **عنوان کارت**، دیالوگ، نام در MatchCard، متن سؤال |
| Button / Active Tab | `button` | 15 / 24 | 700 | دکمه‌ها (خودکار) |
| Body / Input Text | `body1` | 14 / 24 | 500 | **متن اصلی** و متن داخل فیلدها |
| Subtitle / Helper | `body2` | 13 / 22 | 400 | زیرتیتر، توضیح، متن راهنمای فیلد |
| Caption / Badge | `caption` | 11 / 18 | 600 | چیپ، برچسب کوچک، تاریخ |

- دیزاینر سبکی برای این‌ها نداده و از مقیاس بالا مشتق شده‌اند: `subtitle1` = 14/24 وزن 700 (لیبل گروه)، `subtitle2` = 13/22 وزن 600.
- `h4` تا `h6` فقط کپی `h3` هستند تا کامپوننت‌های داخلی MUI از مقیاس بیرون نزنند. **در کد خودمان فقط `h1`، `h2` و `h3`.**
- `textTransform` در فارسی معنی ندارد و همه‌جا خاموش است.
- **اعداد:** استعداد هر رقمی را همان‌طور که هست می‌کشد، پس `86` لاتین نمایش داده می‌شود. هر عدد داینامیک (از API یا state) را با `faDigits()` نمایش دهید: `faDigits(86)` ← «۸۶». قبل از ارسال ورودی کاربر به API از `enDigits()` استفاده کنید. کامپوننت‌های دیزاین سیستم (MatchScore، OtpInput، ScaleQuestion، QuestionnaireProgress) این کار را خودشان می‌کنند.
- برای ورودی‌های عددی (موبایل، کد) از `type="tel"` یا `inputMode="numeric"` استفاده کنید؛ جهتشان خودکار LTR می‌شود.

### فاصله — واحد ۸ پیکسل

`theme.spacing(n)` یا در `sx` مستقیم عدد: `p: 2` = ۱۶px.
مقادیر مجاز: `0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8`

- فاصله داخلی کارت: `3` (۲۴px) — خودکار در `CardContent`
- فاصله بین کارت‌های یک صفحه: `3`
- فاصله بین فیلدهای فرم: `2`
- فاصله عنوان تا توضیح: `0.5`

### گردی گوشه — `theme.radius` (طبق فیگما)

| توکن | مقدار | کاربرد |
|---|---|---|
| `pill` (`--radius-pill`) | 999 | **دکمه‌ها، فیلدها، تاگل‌ها، چیپ‌ها** — همه خودکار از تم |
| `card` (`--radius-card`) | 24 | کارت‌ها، دیالوگ، باکس خوش‌آمدگویی — خودکار |
| `screen` (`--radius-screen`) | 40 | کارت اصلی قاب موبایل |
| `lg` | 16 | Alert/Toast، فیلد چندخطی |
| `xs` / `sm` / `md` | 4 / 8 / 12 | جزئیات کوچک داخلی |

در `sx`، عدد `borderRadius: n` یعنی n × 8px. برای مقادیر بالا از تم بخوانید: `sx={{ borderRadius: (t) => `${t.radius.screen}px` }}`.

### تاگل (ToggleButtonGroup)

طبق فیگما یک «ریل» گرد خاکستری (`surface-muted`) است و گزینه انتخاب‌شده کهربایی پر می‌شود. با `color="error"` روی یک `ToggleButton` (مثل «خط قرمز»)، حالت انتخاب قرمز می‌شود. همه خودکار از تم.

### سایه

فقط `boxShadow: 1` (کم)، `3` (متوسط)، `8` (زیاد = `--shadow-card`). کارت‌ها به‌طور پیش‌فرض outlined و بدون سایه‌اند. سایه‌های رنگی `--shadow-cta-amber` و `--shadow-primary-blue` خودکار روی دکمه‌های contained اعمال می‌شوند.

### ارتفاع کنترل‌ها

`small 32` · `medium 40` (پیش‌فرض) · `large 48` — دکمه و input هم‌اندازه کنار هم قرار می‌گیرند. دایره‌های OTP هم ۴۸ پیکسل‌اند.

---

## ۴. کامپوننت‌ها

### از MUI مستقیم استفاده کنید
`Button`, `TextField`, `Card`, `Chip`, `Alert`, `Dialog`, `Table`, `Grid`, `Stack`, … — استایل‌شان در `theme.ts` تنظیم شده، پس **بدون sx اضافه** همان شکل درست را دارند.

قواعد:
- هر صفحه حداکثر **یک** `Button variant="contained"` اصلی دارد؛ بقیه `outlined` یا `text`.
- CTA اصلی صفحات دانشجو `color="secondary"` (کهربایی)، دکمه اصلی پنل مدیر `color="primary"` (آبی).
- دکمه حذف/خطرناک: `color="error"`.
- `TextField` پیش‌فرض `fullWidth` و `outlined` است؛ عرض را با `Grid` کنترل کنید.
- برای چیدمان از `Stack` (یک‌بعدی) و `Grid` با `size={{ xs, md }}` استفاده کنید.
- آیکون‌ها از `AppIcons` (نام‌های فیگما، مثل `AppIcons.studentId`)؛ اگر آیکونی آنجا نیست، از `@mui/icons-material` نسخه `Rounded` یا `Outlined`.
- فیلدهای فرم صفحه‌های دانشجو/ادمین: `PillField` برای متن و `PillSelect` برای انتخابگر، نه `TextField`.
- دکمه در حال ارسال: `loading loadingPosition="start"` (کهربایی کم‌رنگ با اسپینر، طبق فیگما).
- همه جزئیات فیگما (متن‌ها، صفحه‌ها، حالت‌ها): [FIGMA_SPEC.md](FIGMA_SPEC.md).

### کامپوننت‌های اختصاصی پروژه

| کامپوننت | کاربرد | فیچر |
|---|---|---|
| `PageContainer` | wrapper بیرونی هر صفحه | — |
| `PageHeader` | عنوان + زیرعنوان + اکشن‌های صفحه | — |
| `SectionCard` | کارت با عنوان برای گروه‌بندی بخش‌ها | — |
| `EmptyState` | وقتی لیست/صفحه خالی است | — |
| `MobileFrame` | قاب موبایل صفحه‌های ورود (گوشه ۴۰، سایه کارت) + هدر با دکمه بازگشت + فوتر | فریم ۱ تا ۹ |
| `PillField` | فیلد کپسولی فیگما: لیبل بالا، آیکون، حالت‌های `default` / `valid` / `error`، `revealable` برای رمز | فریم ۱ تا ۹ |
| `PillSelect` | انتخابگر کپسولی هم‌خانواده PillField: همان لیبل بالا و قاب، برای کنار هم قرار گرفتن با فیلدهای متنی | فرم‌های عمومی |
| `ValidationChip` | چیپ قوانین رمز: `valid` ✓ / `error` ✕ / `neutral` ○ | فریم ۴ و ۸ |
| `WelcomeBox` | باکس «سلام … عزیز! 👋» | فریم ۴ و ۸ |
| `IconBadge` | آیکون دایره‌ای بزرگ بالای صفحه OTP (`primary` / `error` / `success`) | فریم ۳ و ۷ |
| `OtpInput` | کد تأیید ۴ رقمی؛ دایره‌ای طبق فیگما (خالی / پر / فعال آبی / خطا / تأییدشده با `verified`)، اعداد فارسی را هم می‌پذیرد | F1.1 |
| `QuestionnaireProgress` | نوار پیشرفت پرسشنامه چندمرحله‌ای | F2.1 |
| `ScaleQuestion` | سؤال طیفی ۱ تا ۵ | F2.2 |
| `PriorityPicker` | اهمیت: کم / متوسط / زیاد / خط قرمز (با سقف ۵) | F3.1–F3.3 |
| `MatchScore` | درصد سازگاری دایره‌ای؛ رنگ خودکار از آستانه‌ها | F4.3 |
| `MatchCard` | کارت پیشنهاد هم‌اتاقی + دلایل + تأیید/رد | F4.5، F5.1، F5.2 |
| `StatusChip` | وضعیت مچ (در انتظار، تأیید، رد، …) | F5.2 |
| `StatCard` | آمار داشبورد مدیر خوابگاه | پنل مدیر |

نمونه:

```tsx
'use client';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { MatchCard, PageContainer, PageHeader } from '@/design-system';

export default function MatchesPage() {
  return (
    <PageContainer>
      <PageHeader title="پیشنهادهای هم‌اتاقی" subtitle="۳ نفر با بیشترین سازگاری" />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <MatchCard
            name="سارا م."
            meta="مهندسی کامپیوتر · ورودی ۱۴۰۴"
            score={86}
            status="pending"
            agreements={['ساعت خواب هر دو حدود ۱۱ شب است']}
            differences={['او موسیقی گوش می‌دهد، ولی با هدفون']}
            onAccept={() => {}}
            onReject={() => {}}
          />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
```

---

## ۵. RTL

- `<html dir="rtl" lang="fa">` و کش Emotion با `stylis-plugin-rtl` تنظیم شده؛ `marginLeft` خودکار به `marginRight` تبدیل می‌شود.
- با این حال برای خوانایی کد از خواص منطقی استفاده کنید: `ms`/`me`، `marginInlineStart`، `insetInlineStart`.
- آیکون‌های جهت‌دار (فلش «بعدی»/«قبلی») در RTL برعکس‌اند: «بعدی» = `ArrowBackRounded`.
- متن انگلیسی یا کد داخل متن فارسی: `<Box component="span" dir="ltr">`.
- **شماره تلفن با فاصله** («۰۹۱۲ ۳۴۵ ۶۷۸۹») در RTL جابه‌جا نمایش داده می‌شود؛ روی متنش `dir="ltr"` بگذارید. در `PillField` با `inputMode: 'tel' | 'numeric'` این کار خودکار است. CSS `direction` کار نمی‌کند چون پلاگین RTL آن را برعکس می‌کند.
- طبق فیگما مقدار داخل فیلدها و دایره‌های OTP با رقم لاتین است؛ اعداد داخل متن با `faDigits()` فارسی.

---

## ۶. روند کار تیمی

**تقسیم کار:**
- **دیزاین سیستم** (`src/design-system/` و صفحه `/design-system`): توکن‌ها، تم و کامپوننت‌های مشترک. صفحه‌ی محصول اینجا ساخته نمی‌شود.
- **صفحه‌ها** (`src/app/...`): ورود، ثبت‌نام، OTP، پرسشنامه، پیشنهادها و پنل مدیر را فرانت‌کارها می‌سازند، فقط با کامپوننت‌های `@/design-system`. مرجع ظاهر و متن هر صفحه: [FIGMA_SPEC.md](FIGMA_SPEC.md).

1. **تغییر در `src/design-system/` فقط با PR جدا** و تأیید نفر دوم. در PR فیچر، دیزاین سیستم را تغییر ندهید.
2. قبل از ساختن کامپوننت جدید، صفحه `/design-system` را نگاه کنید؛ شاید وجود داشته باشد.
3. اگر کامپوننتی در **دو صفحه یا بیشتر** استفاده می‌شود، به `src/design-system/components/` منتقل شود و در `index.ts` و صفحه `/design-system` اضافه شود.
4. کامپوننت‌های مخصوص یک صفحه کنار همان صفحه می‌مانند (`src/app/.../_components/`).
5. چک‌لیست قبل از PR:
   - [ ] `npm run lint` بدون خطا
   - [ ] `npm run typecheck` بدون خطا
   - [ ] در عرض موبایل (۳۷۵px) چک شده
   - [ ] هیچ رنگ/fontSize/fontFamily/fontWeight/lineHeight/borderRadius/boxShadow دستی ندارد
   - [ ] متن وضعیت با `statusText.*` و حلقه/آیکون/بوردر وضعیت با `statusStroke.*` است
   - [ ] متن‌ها فارسی و با نیم‌فاصله درست (‌می‌شود، نه «می شود»)

---

## ۷. دستورات

```bash
npm install
npm run dev        # http://localhost:3000/design-system
npm run lint
npm run typecheck
npm run build
```
