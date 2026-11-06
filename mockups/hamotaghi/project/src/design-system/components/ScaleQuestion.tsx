'use client';

import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { faDigits } from '../digits';

type ScaleQuestionProps = {
  question: string;
  hint?: string;
  value: number | null;
  onChange: (value: number) => void;
  /** Label under the first option, e.g. «اصلاً». */
  minLabel: string;
  /** Label under the last option, e.g. «خیلی زیاد». */
  maxLabel: string;
  steps?: number;
};

/** Spectrum ("طیفی") question type from F2.2: pick a point between two extremes. */
export function ScaleQuestion({ question, hint, value, onChange, minLabel, maxLabel, steps = 5 }: ScaleQuestionProps) {
  const points = Array.from({ length: steps }, (_, i) => i + 1);

  return (
    <Stack spacing={1.5}>
      <Stack spacing={0.5}>
        <Typography variant="h3" component="p">
          {question}
        </Typography>
        {hint && (
          <Typography variant="body2" color="text.secondary">
            {hint}
          </Typography>
        )}
      </Stack>
      <ToggleButtonGroup
        exclusive
        fullWidth
        value={value}
        onChange={(_, next: number | null) => next !== null && onChange(next)}
        aria-label={question}
      >
        {points.map((point) => (
          <ToggleButton key={point} value={point} aria-label={faDigits(point)}>
            {faDigits(point)}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          {minLabel}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {maxLabel}
        </Typography>
      </Stack>
    </Stack>
  );
}
