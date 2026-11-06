'use client';

import ApartmentRounded from '@mui/icons-material/ApartmentRounded';
import GroupsRounded from '@mui/icons-material/GroupsRounded';
import SearchOffRounded from '@mui/icons-material/SearchOffRounded';
import SwapHorizRounded from '@mui/icons-material/SwapHorizRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import {
  AppIcons,
  EmptyState,
  IconBadge,
  MobileFrame,
  PillField,
  ValidationChip,
  WelcomeBox,
  MatchCard,
  MatchScore,
  OtpInput,
  PageContainer,
  PageHeader,
  PillSelect,
  PriorityPicker,
  QuestionnaireProgress,
  ScaleQuestion,
  SectionCard,
  StatCard,
  StatusChip,
  tokens,
  type MatchStatus,
  type Priority,
} from '@/design-system';

// The designer's seven styles (Figma name → MUI variant). h4–h6 are aliases of h3 and not shown.
const typeStyles = [
  ['h1', 'Display / H1'],
  ['h2', 'Heading 2'],
  ['h3', 'Title / Nav Header'],
  ['button', 'Button / Active Tab'],
  ['body1', 'Body / Input Text'],
  ['body2', 'Subtitle / Helper'],
  ['caption', 'Caption / Badge'],
] as const;
const statuses: MatchStatus[] = ['pending', 'waitingOther', 'accepted', 'rejected', 'locked'];

function remToPx(rem: string) {
  return Math.round(parseFloat(rem) * tokens.rootFontSize);
}

/** Radius previews are capped at half the swatch height, so `pill` reads as a full capsule. */
function previewRadius(value: number) {
  return value >= tokens.radius.pill ? '50%' : `${value}px`;
}

/** One color card, laid out like the designer's Figma swatches. */
function ColorCard({ token, value, usage, label }: { token: string; value: string; usage: string; label?: string }) {
  return (
    <Box
      sx={{
        border: tokens.borderWidth.hairline,
        borderColor: 'divider',
        borderRadius: (t) => `${t.radius.lg}px`,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          height: (t) => t.spacing(9),
          bgcolor: value,
          borderBottom: tokens.borderWidth.hairline,
          borderColor: 'divider',
        }}
      />
      <Stack spacing={0.5} sx={{ p: 1.5 }}>
        <Typography variant="caption" dir="ltr" sx={{ textAlign: 'end', color: 'text.primary' }}>
          {token}
        </Typography>
        <Typography variant="h3" component="p" dir="ltr" color="primary" sx={{ textAlign: 'end' }}>
          {value}
          {label && (
            <Typography component="span" variant="body2" color="text.secondary">
              {' '}
              ({label})
            </Typography>
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {usage}
        </Typography>
      </Stack>
    </Box>
  );
}

const paletteGrid = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))', md: 'repeat(5, minmax(0, 1fr))' },
} as const;

export default function DesignSystemPage() {
  const [scale, setScale] = useState<number | null>(3);
  const [priority, setPriority] = useState<Priority>('high');
  const [otp, setOtp] = useState('');
  const [authTab, setAuthTab] = useState<'signup' | 'login'>('signup');
  const [frameOtp, setFrameOtp] = useState('47');
  const [studentId, setStudentId] = useState('402105892');

  return (
    <PageContainer>
      <PageHeader
        title="دیزاین سیستم هم‌اتاقی"
        subtitle="مرجع مشترک رنگ، تایپوگرافی، فاصله‌ها و کامپوننت‌ها. هر چیزی که اینجا نیست، اول به دیزاین سیستم اضافه شود."
      />

      <Stack spacing={3}>
        <Alert severity="info">
          این صفحه خودش با همان قواعدی ساخته شده که مستند می‌کند: هیچ رنگ، فونت، اندازه فونت، گردی یا سایه‌ای خارج از
          <Box component="span" dir="ltr" sx={{ mx: 0.5, fontWeight: 'fontWeightBold' }}>
            src/design-system
          </Box>
          تعریف نشده است. اجرای <Box component="span" dir="ltr" sx={{ fontWeight: 'fontWeightBold' }}>npm run lint</Box> این
          قرارداد را بررسی می‌کند.
        </Alert>

        {/* ---------------- Colors (mirrors Figma section 1 and 2) ---------------- */}
        <SectionCard
          title="۱. پالت رنگ‌های اصلی، مکمل و معنایی (Color Palette)"
          description="همان چیدمان فیگما. در کد فقط از نقش‌های تم استفاده کنید (primary، secondary، success، error، info)، نه کد هگز."
        >
          <Stack spacing={3}>
            {tokens.figmaPalette.map((group) => (
              <Stack key={group.title} spacing={1.5}>
                <Typography variant="subtitle1" component="h3">
                  {group.title}
                </Typography>
                <Box sx={paletteGrid}>
                  {group.swatches.map((swatch) => (
                    <ColorCard key={swatch.token} {...swatch} />
                  ))}
                </Box>
              </Stack>
            ))}
            <Alert severity="info">
              فیگما رنگ «هشدار» ندارد. نقش warning در کد از رنگ Hover مکمل (D97706) استفاده می‌کند. برای متن، توکن
              <Box component="span" dir="ltr" sx={{ mx: 0.5, fontWeight: 'fontWeightBold' }}>
                statusText.warning
              </Box>
              نسخه‌ی تیره‌تر و خوانا را می‌دهد.
            </Alert>
          </Stack>
        </SectionCard>

        <SectionCard title="۲. سطوح، متن‌ها و خطوط جداکننده (Surface, Text & Border Tokens)">
          <Box
            sx={{
              ...paletteGrid,
              gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
            }}
          >
            {tokens.figmaSurfaces.map((swatch) => (
              <ColorCard key={swatch.token} {...swatch} />
            ))}
          </Box>
        </SectionCard>

        {/* ---------------- Typography ---------------- */}
        <SectionCard
          title="تایپوگرافی"
          description="فونت استعداد، ۷ سبک طبق فیگما. فقط از variantها استفاده کنید؛ fontSize دستی ممنوع است. اعداد داینامیک را با faDigits() فارسی کنید."
        >
          <Stack spacing={2}>
            {typeStyles.map(([v, figmaName]) => {
              const t = tokens.typeScale[v];
              return (
                <Stack
                  key={v}
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 0.5, sm: 3 }}
                  sx={{ alignItems: { sm: 'baseline' } }}
                >
                  <Box sx={{ flexBasis: { sm: '25%' }, flexShrink: 0 }}>
                    <Typography variant="caption" color="primary" dir="ltr" component="div" sx={{ textAlign: 'end' }}>
                      {figmaName} · variant=&quot;{v}&quot;
                    </Typography>
                    <Typography variant="caption" color="text.secondary" dir="ltr" component="div" sx={{ textAlign: 'end' }}>
                      Estedad {t.fontWeight} · {remToPx(t.fontSize)}px / {t.lineHeight}
                    </Typography>
                  </Box>
                  <Typography variant={v}>هم‌اتاقی سازگار، خواب آرام ۱۲۳</Typography>
                </Stack>
              );
            })}
          </Stack>
        </SectionCard>

        {/* ---------------- Spacing / radius / shadow ---------------- */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <SectionCard title="فاصله‌ها" description="واحد پایه ۸ پیکسل: theme.spacing(n)" sx={{ height: '100%' }}>
              <Stack spacing={1}>
                {[0.5, 1, 1.5, 2, 3, 4, 5, 6, 8].map((n) => (
                  <Stack key={n} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ width: (t) => t.spacing(8) }}>
                      {n} = {n * tokens.spacingUnit}px
                    </Typography>
                    <Box
                      sx={{
                        height: (t) => t.spacing(1.5),
                        width: n * tokens.spacingUnit,
                        bgcolor: 'primary.main',
                        borderRadius: (t) => `${t.radius.xs}px`,
                      }}
                    />
                  </Stack>
                ))}
              </Stack>
            </SectionCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SectionCard title="گردی گوشه‌ها" description="theme.radius" sx={{ height: '100%' }}>
              <Grid container spacing={1.5}>
                {Object.entries(tokens.radius).map(([name, value]) => (
                  <Grid key={name} size={4}>
                    <Box
                      sx={{
                        height: (t) => t.spacing(7),
                        bgcolor: 'background.default',
                        border: tokens.borderWidth.hairline,
                        borderColor: 'divider',
                        borderRadius: previewRadius(value),
                      }}
                    />
                    <Typography variant="caption">
                      {name} · {value === tokens.radius.pill ? '∞' : value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </SectionCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SectionCard title="سایه‌ها" description="فقط سه سطح: elevation 1، 3 و 8" sx={{ height: '100%' }}>
              <Stack spacing={2}>
                {[1, 3, 8].map((e) => (
                  <Box
                    key={e}
                    sx={{
                      p: 2,
                      borderRadius: (t) => `${t.radius.lg}px`,
                      bgcolor: 'background.paper',
                      boxShadow: e,
                    }}
                  >
                    <Typography variant="body2">elevation {e}</Typography>
                  </Box>
                ))}
              </Stack>
            </SectionCard>
          </Grid>
        </Grid>

        {/* ---------------- Buttons ---------------- */}
        <SectionCard
          title="دکمه‌ها"
          description="CTA اصلی صفحات دانشجو: کهربایی (secondary). دکمه اصلی پنل مدیر: آبی (primary). هر صفحه فقط یک دکمه contained اصلی."
        >
          <Stack spacing={2}>
            {(['large', 'medium', 'small'] as const).map((size) => (
              <Stack key={size} direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
                <Button size={size} variant="contained" color="secondary">
                  دریافت کد تأیید
                </Button>
                <Button size={size} variant="contained">
                  ورود مدیر خوابگاه
                </Button>
                <Button size={size} variant="outlined">
                  ذخیره و ادامه بعداً
                </Button>
                <Button size={size} variant="text">
                  بازگشت
                </Button>
                <Button size={size} variant="contained" color="error">
                  حذف حساب
                </Button>
                <Button size={size} variant="contained" disabled>
                  غیرفعال
                </Button>
              </Stack>
            ))}
          </Stack>
        </SectionCard>

        {/* ---------------- Form controls ---------------- */}
        <SectionCard
          title="فرم‌ها"
          description="فیلدهای متنی و انتخابگرها با PillField / PillSelect ساخته می‌شوند؛ رادیو، چک‌باکس و سوییچ از MUI می‌آیند."
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <PillField
                label="شماره موبایل"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                inputProps={{ inputMode: 'tel' }}
                helperText="کد تأیید به این شماره پیامک می‌شود"
                icon={<AppIcons.phoneMobile fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <PillSelect label="رشته تحصیلی" defaultValue="ce">
                <MenuItem value="ce">مهندسی کامپیوتر</MenuItem>
                <MenuItem value="ee">مهندسی برق</MenuItem>
                <MenuItem value="me">مهندسی مکانیک</MenuItem>
              </PillSelect>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <PillField
                label="شماره دانشجویی"
                status="error"
                helperText="شماره دانشجویی در لیست خوابگاه نیست"
                defaultValue="40012345"
                inputProps={{ inputMode: 'numeric' }}
                icon={<AppIcons.studentId fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RadioGroup row defaultValue="in">
                <FormControlLabel value="in" control={<Radio />} label="مطالعه در اتاق" />
                <FormControlLabel value="out" control={<Radio />} label="مطالعه بیرون از اتاق" />
              </RadioGroup>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel control={<Checkbox defaultChecked />} label="نام کامل من به مچ‌ها نمایش داده شود" />
              <FormControlLabel control={<Switch defaultChecked />} label="اعلان پیامکی" />
            </Grid>
          </Grid>
        </SectionCard>

        {/* ---------------- Feedback ---------------- */}
        <SectionCard title="بازخورد و برچسب‌ها">
          <Stack spacing={1.5}>
            <Alert severity="success">پاسخ‌های شما ذخیره شد.</Alert>
            <Alert severity="info">تطبیق پس از پایان مهلت ثبت‌نام، ۱۵ مهر قفل می‌شود.</Alert>
            <Alert severity="warning">هنوز ۲ بخش از پرسشنامه باقی مانده است.</Alert>
            <Alert severity="error">ارسال کد تأیید ناموفق بود. دوباره تلاش کنید.</Alert>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', pt: 1 }}>
              {statuses.map((s) => (
                <StatusChip key={s} status={s} />
              ))}
              <Chip label="خواب" />
              <Chip label="نظافت" color="primary" />
            </Stack>
          </Stack>
        </SectionCard>

        {/* ---------------- Figma UI kit ---------------- */}
        <Typography variant="h2" sx={{ pt: 2 }}>
          کتابخانه وضعیت کامپوننت‌ها (UI Kit فیگما)
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <SectionCard
              title="۱. فیلد ورودی کپسولی"
              description="PillField — پیش‌فرض، فوکوس، معتبر، خطا"
              sx={{ height: '100%' }}
            >
              <Stack spacing={2.5}>
                <PillField
                  label="حالت پیش‌فرض (Default / Empty)"
                  placeholder="مثلاً 402105892"
                  icon={<AppIcons.studentId fontSize="small" />}
                />
                <PillField
                  label="حالت فوکوس (روی آن کلیک کنید)"
                  defaultValue="40210"
                  icon={<AppIcons.studentId fontSize="small" />}
                />
                <PillField label="حالت معتبر و تأییدشده (Valid)" defaultValue="402105892" status="valid" />
                <PillField
                  label="حالت خطا (Invalid / Error)"
                  defaultValue="9988"
                  status="error"
                  helperText="کد دانشجویی نامعتبر است."
                />
              </Stack>
            </SectionCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SectionCard title="۲ تا ۴. OTP، چیپ‌ها و بنرها" description="OtpInput · ValidationChip · Alert" sx={{ height: '100%' }}>
              <Stack spacing={3}>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">خانه‌های کد تأیید: پر و خالی (فعال با کلیک)، خطا، تأییدشده</Typography>
                  <OtpInput value="47" onChange={() => {}} />
                  <OtpInput value="4729" onChange={() => {}} error />
                  <OtpInput value="4729" onChange={() => {}} verified />
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">چیپ‌های اعتبارسنجی رمز</Typography>
                  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                    <ValidationChip status="valid">حداقل ۸ کاراکتر (معتبر)</ValidationChip>
                    <ValidationChip status="error">عدم تطابق دو رمز (خطا)</ValidationChip>
                    <ValidationChip status="neutral">حداقل ۸ کاراکتر (خنثی)</ValidationChip>
                  </Stack>
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">بنرهای هشدار و وضعیت</Typography>
                  <Alert severity="error">خطا: شماره همراه با کد دانشجویی همخوانی ندارد.</Alert>
                  <Alert severity="success">موفق: رمز مخصوص شما با موفقیت ثبت شد!</Alert>
                </Stack>
              </Stack>
            </SectionCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SectionCard
              title="۵. وضعیت‌های دکمه اصلی"
              description="Button — CTA کهربایی و دکمه آبی ادمین"
              sx={{ height: '100%' }}
            >
              <Stack spacing={2}>
                <Button size="large" variant="contained" color="secondary" fullWidth>
                  حالت عادی (Default CTA)
                </Button>
                <Button size="large" variant="contained" color="secondary" fullWidth sx={{ bgcolor: 'secondary.dark' }}>
                  حالت هاور / فشرده (Hover / Pressed)
                </Button>
                <Button size="large" variant="contained" color="secondary" fullWidth loading loadingPosition="start">
                  در حال بررسی اطلاعات...
                </Button>
                <Button size="large" variant="contained" color="secondary" fullWidth disabled>
                  غیرفعال (Disabled State)
                </Button>
                <Button size="large" variant="contained" color="primary" fullWidth>
                  دکمه اصلی پنل ادمین (Primary Blue)
                </Button>
              </Stack>
            </SectionCard>
          </Grid>
        </Grid>

        {/* ---------------- Sample screens (Figma frames 1, 3, 4) ---------------- */}
        <Typography variant="h2" sx={{ pt: 2 }}>
          نمونه صفحه‌ها با همین کامپوننت‌ها (فریم ۱، ۳ و ۴ فیگما)
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          <MobileFrame
            footer={
              <Button
                size="small"
                color="inherit"
                startIcon={<AppIcons.shieldAdmin fontSize="small" />}
                sx={{ bgcolor: 'background.subtle', color: 'text.secondary', px: 2 }}
              >
                ورود به عنوان ادمین (امور خوابگاه‌ها)
              </Button>
            }
          >
            <Stack spacing={3}>
              <Stack spacing={0.5} sx={{ textAlign: 'center' }}>
                <Typography variant="h1" component="h2">
                  شروع کنید
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  برای پیدا کردن هم‌اتاقی سازگار، حساب بسازید یا وارد شوید
                </Typography>
              </Stack>
              <ToggleButtonGroup
                exclusive
                fullWidth
                value={authTab}
                onChange={(_, v) => v && setAuthTab(v)}
                aria-label="ثبت‌نام یا ورود"
              >
                <ToggleButton value="signup">ثبت‌نام</ToggleButton>
                <ToggleButton value="login">ورود</ToggleButton>
              </ToggleButtonGroup>
              <PillField
                label="کد دانشجویی"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                icon={<AppIcons.studentId fontSize="small" />}
                inputProps={{ inputMode: 'numeric' }}
              />
              <PillField
                label="شماره تلفن همراه"
                defaultValue="0912 345 6789"
                icon={<AppIcons.phoneMobile fontSize="small" />}
                inputProps={{ inputMode: 'tel' }}
              />
              <Button size="large" variant="contained" color="secondary" fullWidth>
                دریافت کد تأیید
              </Button>
            </Stack>
          </MobileFrame>

          <MobileFrame title="اعتبارسنجی شماره" titleComponent="h2" onBack={() => {}}>
            <Stack spacing={3} sx={{ textAlign: 'center' }}>
              <IconBadge>
                <AppIcons.otpMessage />
              </IconBadge>
              <Stack spacing={0.5}>
                <Typography variant="h2" component="p">
                  کد تأیید
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  کد ۴ رقمی ارسال شده به شماره همراه زیر را وارد کنید
                </Typography>
                <Typography variant="h3" component="p" dir="ltr">
                  ۰۹۱۲ ۳۴۵ ۶۷۸۹
                </Typography>
              </Stack>
              <OtpInput value={frameOtp} onChange={setFrameOtp} />
              <Button size="large" variant="contained" color="secondary" fullWidth>
                تأیید و ادامه
              </Button>
              <Typography variant="body2" color="text.secondary">
                کد را دریافت نکردید؟{' '}
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 'fontWeightBold' }}>
                  ارسال مجدد (۰۱:۲۴)
                </Box>
              </Typography>
            </Stack>
          </MobileFrame>

          <MobileFrame title="تنظیم رمز مخصوص" titleComponent="h2" onBack={() => {}}>
            <Stack spacing={2.5}>
              <WelcomeBox title="سلام سجاد موسوی عزیز! 👋">
                رمز مخصوص خودت رو انتخاب کن تا از این به بعد به راحتی با کد دانشجویی و رمز عبور وارد سامانه بشی.
              </WelcomeBox>
              <PillField
                label="رمز عبور مخصوص"
                defaultValue="Sajad1384@"
                revealable
                icon={<AppIcons.lockPassword fontSize="small" />}
              />
              <PillField label="تکرار رمز عبور" defaultValue="Sajad1384@" type="password" status="valid" />
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                <ValidationChip status="valid">شامل حروف و عدد</ValidationChip>
                <ValidationChip status="valid">حداقل ۸ کاراکتر</ValidationChip>
              </Stack>
              <Button size="large" variant="contained" color="secondary" fullWidth>
                ثبت رمز و ورود به سامانه
              </Button>
            </Stack>
          </MobileFrame>
        </Box>

        {/* ---------------- Domain components ---------------- */}
        <Typography variant="h2" sx={{ pt: 2 }}>
          کامپوننت‌های اختصاصی
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard
              title="پرسشنامه"
              description="QuestionnaireProgress · ScaleQuestion · PriorityPicker"
              sx={{ height: '100%' }}
            >
              <Stack spacing={3}>
                <QuestionnaireProgress step={3} total={8} category="سروصدا" />
                <ScaleQuestion
                  question="چقدر به سروصدا هنگام مطالعه حساس هستید؟"
                  hint="در نظر بگیرید در روزهای امتحان چه حالی دارید."
                  value={scale}
                  onChange={setScale}
                  minLabel="اصلاً"
                  maxLabel="خیلی زیاد"
                />
                <PriorityPicker value={priority} onChange={setPriority} />
                <PriorityPicker value="low" onChange={() => {}} requiredLimitReached label="حالت سقف خط قرمز" />
              </Stack>
            </SectionCard>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <MatchCard
              name="سارا م."
              meta="مهندسی کامپیوتر · ورودی ۱۴۰۴"
              score={86}
              status="pending"
              agreements={['ساعت خواب هر دو حدود ۱۱ شب است', 'حساسیت نظافت شما مشابه است', 'هیچ‌کدام سیگاری نیستید']}
              differences={['او موسیقی گوش می‌دهد، ولی از هدفون استفاده می‌کند']}
              onAccept={() => {}}
              onReject={() => {}}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="امتیاز سازگاری" description="MatchScore — رنگ از آستانه‌های توکن می‌آید" sx={{ height: '100%' }}>
              <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-around' }}>
                <MatchScore score={91} size="large" />
                <MatchScore score={62} />
                <MatchScore score={34} size="small" />
              </Stack>
            </SectionCard>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="کد تأیید" description="OtpInput — اعداد فارسی هم پذیرفته می‌شوند" sx={{ height: '100%' }}>
              <Stack spacing={3}>
                <OtpInput value={otp} onChange={setOtp} helperText="کد ۴ رقمی پیامک‌شده را وارد کنید" />
                <OtpInput value="4071" onChange={() => {}} length={4} error helperText="کد وارد شده اشتباه است" />
              </Stack>
            </SectionCard>
          </Grid>
        </Grid>

        <Typography variant="h2" sx={{ pt: 1 }}>
          پنل مدیر خوابگاه
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="دانشجویان ثبت‌نامی" value="۱٬۲۴۸" helper="۸۷٪ پرسشنامه را کامل کرده‌اند" icon={<GroupsRounded />} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="جفت‌های تأییدشده" value="۴۱۲" icon={<ApartmentRounded />} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="میانگین سازگاری" value="۷۸٪" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="درخواست تعویض اتاق" value="۱۹" helper="۲۳٪ کمتر از ترم قبل" icon={<SwapHorizRounded />} />
          </Grid>
          <Grid size={12}>
            <SectionCard>
              <EmptyState
                icon={<SearchOffRounded />}
                title="هنوز پیشنهادی برای شما نداریم"
                description="بعد از تکمیل پرسشنامه و پایان مهلت ثبت‌نام، بهترین هم‌اتاقی‌ها اینجا نمایش داده می‌شوند."
                action={
                  <Button variant="contained" color="secondary">
                    تکمیل پرسشنامه
                  </Button>
                }
              />
            </SectionCard>
          </Grid>
        </Grid>
      </Stack>
    </PageContainer>
  );
}
