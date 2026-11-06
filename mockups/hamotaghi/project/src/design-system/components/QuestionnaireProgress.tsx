'use client';

import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { faDigits } from '../digits';

type QuestionnaireProgressProps = {
  /** 1-based current step. */
  step: number;
  total: number;
  /** Current category, e.g. «خواب» or «نظافت و نظم». */
  category?: string;
};

/** Progress bar at the top of the multi-step questionnaire (F2.1). */
export function QuestionnaireProgress({ step, total, category }: QuestionnaireProgressProps) {
  const percent = total > 0 ? Math.round((Math.min(step, total) / total) * 100) : 0;

  return (
    <Stack spacing={1}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography variant="subtitle2">{category ? `بخش ${category}` : 'پرسشنامه'}</Typography>
        <Typography variant="caption" color="text.secondary">
          مرحله {faDigits(step)} از {faDigits(total)}
        </Typography>
      </Stack>
      <LinearProgress variant="determinate" value={percent} aria-label={`پیشرفت پرسشنامه: ${faDigits(percent)} درصد`} />
    </Stack>
  );
}
