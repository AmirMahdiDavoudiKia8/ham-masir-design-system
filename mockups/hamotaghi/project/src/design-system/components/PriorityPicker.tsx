'use client';

import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

export type Priority = 'low' | 'medium' | 'high' | 'required';

const options: { value: Priority; label: string }[] = [
  { value: 'low', label: 'کم' },
  { value: 'medium', label: 'متوسط' },
  { value: 'high', label: 'زیاد' },
  { value: 'required', label: 'خط قرمز' },
];

type PriorityPickerProps = {
  value: Priority;
  onChange: (value: Priority) => void;
  label?: string;
  /** True when the user already has the maximum number of red lines (F3.3). */
  requiredLimitReached?: boolean;
};

/** How much a preference matters: a weight (F3.2) or a non-negotiable «خط قرمز» (F3.1). */
export function PriorityPicker({
  value,
  onChange,
  label = 'این مورد چقدر برایتان مهم است؟',
  requiredLimitReached = false,
}: PriorityPickerProps) {
  const requiredDisabled = requiredLimitReached && value !== 'required';

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{label}</Typography>
      <ToggleButtonGroup
        exclusive
        fullWidth
        size="small"
        value={value}
        onChange={(_, next: Priority | null) => next && onChange(next)}
        aria-label={label}
      >
        {options.map((option) => (
          <ToggleButton
            key={option.value}
            value={option.value}
            disabled={option.value === 'required' && requiredDisabled}
            color={option.value === 'required' ? 'error' : 'primary'}
          >
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {requiredDisabled && (
        <Typography variant="caption" color="text.secondary">
          به سقف ۵ خط قرمز رسیده‌اید؛ برای افزودن، یکی دیگر را بردارید.
        </Typography>
      )}
    </Stack>
  );
}
