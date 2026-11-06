'use client';

import PaletteRounded from '@mui/icons-material/PaletteRounded';
import TextFieldsRounded from '@mui/icons-material/TextFieldsRounded';
import VerifiedRounded from '@mui/icons-material/VerifiedRounded';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PageContainer, PageHeader, SectionCard, StatCard } from '@/design-system';

export default function HomePage() {
  return (
    <PageContainer>
      <PageHeader
        title="هم‌اتاقی"
        subtitle="سامانه هوشمند تطبیق هم‌اتاقی خوابگاهی"
        actions={
          <Button size="large" variant="contained" color="secondary" component={Link} href="/design-system">
            مشاهده دیزاین سیستم
          </Button>
        }
      />

      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard label="کامپوننت آماده" value="۱۸" helper="Layout، فرم، بازخورد و کامپوننت‌های دامنه" icon={<PaletteRounded />} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard label="سبک تایپوگرافی" value="۷" helper="روی فونت Estedad، مطابق مقیاس فیگما" icon={<TextFieldsRounded />} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard label="کنتراست متن" value="AA" helper="توکن‌های statusText برای متن‌های وضعیت" icon={<VerifiedRounded />} />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <SectionCard
              title="یک منبع واحد برای کل رابط"
              description="رنگ، فونت، اندازه، گردی و سایه فقط یک‌جا تعریف می‌شوند."
            >
              <Stack spacing={1.5}>
                <Typography variant="body1">
                  دیزاین سیستم هم‌اتاقی مرجع مشترک دو توسعه‌دهنده فرانت‌اند است: توکن‌ها، تم MUI، کامپوننت‌های آماده و یک
                  صفحه‌ی نمایش زنده که همه‌ی حالت‌ها را کنار هم نشان می‌دهد.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  قاعده‌ی طلایی: هیچ رنگ، فونت، اندازه فونت، گردی یا سایه‌ای خارج از
                  <Typography component="span" variant="body2" dir="ltr" sx={{ mx: 0.5, fontWeight: 'fontWeightBold' }}>
                    src/design-system
                  </Typography>
                  نوشته نمی‌شود. ESLint این قرارداد را در
                  <Typography component="span" variant="body2" dir="ltr" sx={{ mx: 0.5, fontWeight: 'fontWeightBold' }}>
                    npm run lint
                  </Typography>
                  بررسی می‌کند.
                </Typography>
              </Stack>
            </SectionCard>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <SectionCard title="شروع سریع" description="سه قدم تا ساختن اولین صفحه">
              <Stack spacing={1.5}>
                <Typography variant="body2">
                  ۱. کامپوننت‌ها را از مسیر واحد{' '}
                  <Typography component="span" variant="body2" dir="ltr" sx={{ fontWeight: 'fontWeightBold' }}>
                    @/design-system
                  </Typography>{' '}
                  ایمپورت کنید.
                </Typography>
                <Typography variant="body2">۲. برای هر مقدار بصری، از variant یا theme استفاده کنید؛ عدد خام ننویسید.</Typography>
                <Typography variant="body2">۳. قبل از هر PR، lint و typecheck را اجرا کنید.</Typography>
                <Button variant="contained" component={Link} href="/design-system" sx={{ alignSelf: 'flex-start' }}>
                  دیدن توکن‌ها و کامپوننت‌ها
                </Button>
              </Stack>
            </SectionCard>
          </Grid>
        </Grid>

        <Alert severity="info">
          صفحه‌ی دیزاین سیستم خودش با همین قواعد ساخته شده است؛ اگر جایی مقدار خام ببینید، یعنی یک باگ در دیزاین سیستم
          است، نه یک استثنا.
        </Alert>
      </Stack>
    </PageContainer>
  );
}
