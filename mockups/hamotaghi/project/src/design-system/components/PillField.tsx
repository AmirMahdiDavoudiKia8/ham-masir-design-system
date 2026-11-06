'use client';

import CancelOutlined from '@mui/icons-material/CancelOutlined';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput, { type OutlinedInputProps } from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useId, useState, type ReactNode } from 'react';
import { AppIcons } from '../icons';
import { controlHeight, statusStroke, statusText } from '../tokens';

export type PillFieldStatus = 'default' | 'valid' | 'error';

type PillFieldProps = Omit<OutlinedInputProps, 'error' | 'startAdornment' | 'endAdornment' | 'label'> & {
  label: string;
  /** Field icon at the start (right in RTL), e.g. <AppIcons.studentId />. Replaced by a status icon when valid or error. */
  icon?: ReactNode;
  /** Figma «Pill Input Variants»: default / valid (verified) / error. Focus is handled automatically. */
  status?: PillFieldStatus;
  helperText?: ReactNode;
  /** Link or action shown at the end of the label row, e.g. «فراموشی رمز؟». */
  labelAction?: ReactNode;
  /** Password field with the eye toggle. */
  revealable?: boolean;
};

/**
 * The capsule text field from the Figma UI kit: label above, icon at the start,
 * and the four states (default, focused, valid, error).
 */
export function PillField({
  label,
  icon,
  status = 'default',
  helperText,
  labelAction,
  revealable,
  id,
  type,
  inputProps,
  sx,
  ...props
}: PillFieldProps) {
  const autoId = useId();
  // Phone numbers and codes ("0912 345 6789") must stay left-to-right or their groups swap places.
  const ltr = type === 'tel' || inputProps?.inputMode === 'tel' || inputProps?.inputMode === 'numeric';
  const inputId = id ?? autoId;
  const [revealed, setRevealed] = useState(false);

  const statusIcon =
    status === 'valid' ? (
      <AppIcons.checkVerified fontSize="small" sx={{ color: statusStroke.success }} />
    ) : status === 'error' ? (
      <CancelOutlined fontSize="small" sx={{ color: statusText.error }} />
    ) : (
      icon
    );

  return (
    <FormControl error={status === 'error'}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
        <Typography component="label" htmlFor={inputId} variant="subtitle2">
          {label}
        </Typography>
        {labelAction}
      </Stack>
      <OutlinedInput
        id={inputId}
        type={revealable ? (revealed ? 'text' : 'password') : type}
        error={status === 'error'}
        startAdornment={
          statusIcon ? (
            <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
              {statusIcon}
            </InputAdornment>
          ) : undefined
        }
        endAdornment={
          revealable ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                edge="end"
                aria-label={revealed ? 'مخفی کردن رمز' : 'نمایش رمز'}
                onClick={() => setRevealed((v) => !v)}
              >
                {revealed ? <AppIcons.eyeHidden fontSize="small" /> : <AppIcons.eyeVisibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ) : undefined
        }
        inputProps={ltr ? { dir: 'ltr', ...inputProps } : inputProps}
        aria-describedby={helperText ? `${inputId}-helper` : undefined}
        sx={[
          { minHeight: controlHeight.large, typography: 'body1' },
          status === 'valid' && {
            bgcolor: 'success.light',
            '& .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: statusStroke.success,
            },
          },
          status === 'error' && {
            bgcolor: 'error.light',
            '& .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: statusStroke.error,
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
      />
      {helperText && <FormHelperText id={`${inputId}-helper`}>{helperText}</FormHelperText>}
    </FormControl>
  );
}
