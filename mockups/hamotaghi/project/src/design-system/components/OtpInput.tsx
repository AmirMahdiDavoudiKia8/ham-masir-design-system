'use client';

import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useId, useRef, type ClipboardEvent, type KeyboardEvent } from 'react';
import { enDigits, faDigits } from '../digits';
import { borderWidth, color, controlHeight, statusStroke, statusText } from '../tokens';

type OtpInputProps = {
  /** ASCII digits, e.g. "4071". Persian keyboard input is converted automatically. */
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: boolean;
  /** Code accepted: every circle turns green (Figma «Verified»). */
  verified?: boolean;
  helperText?: string;
  autoFocus?: boolean;
};

const onlyDigits = (input: string) => enDigits(input).replace(/\D/g, '');

/**
 * SMS verification code input (F1.1), drawn as the Figma «OTP Circle States»:
 * Empty and Filled are outlined, Active is filled brand blue, Error is red and
 * Verified is green. The code is 4 digits and, as in Figma, the circles show
 * Latin digits. Always laid out left-to-right.
 */
export function OtpInput({ value, onChange, length = 4, error, verified, helperText, autoFocus }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const helperId = useId();
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const setAt = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join('').slice(0, length));
  };

  const handleChange = (index: number, raw: string) => {
    const digit = onlyDigits(raw).slice(-1);
    setAt(index, digit);
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      setAt(index - 1, '');
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    const pasted = onlyDigits(e.clipboardData.getData('text')).slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} useFlexGap dir="ltr" sx={{ justifyContent: 'center' }} onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <InputBase
            key={index}
            inputRef={(el: HTMLInputElement | null) => {
              refs.current[index] = el;
            }}
            value={digit}
            autoFocus={autoFocus && index === 0}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e as KeyboardEvent<HTMLInputElement>)}
            inputProps={{
              inputMode: 'numeric',
              autoComplete: index === 0 ? 'one-time-code' : 'off',
              'aria-label': `رقم ${faDigits(index + 1)}`,
              'aria-invalid': error || undefined,
              'aria-describedby': helperText ? helperId : undefined,
            }}
            sx={{
              width: controlHeight.large,
              height: controlHeight.large,
              borderRadius: '50%',
              border: borderWidth.thick,
              borderColor: error
                ? statusStroke.error
                : verified
                  ? statusStroke.success
                  : digit
                    ? 'text.disabled'
                    : color.border,
              bgcolor: error ? 'error.light' : verified ? 'success.light' : 'background.paper',
              color: error ? statusText.error : verified ? statusText.success : 'text.primary',
              typography: 'h2',
              transition: (t) => t.transitions.create(['background-color', 'border-color', 'color']),
              '&.Mui-focused': error
                ? { bgcolor: statusText.error, borderColor: statusText.error, color: color.background.paper }
                : { bgcolor: 'primary.main', borderColor: 'primary.main', color: 'primary.contrastText', boxShadow: 2 },
              '& input': { textAlign: 'center', p: 0, caretColor: 'transparent' },
            }}
          />
        ))}
      </Stack>
      {helperText && (
        <Typography
          id={helperId}
          variant="body2"
          sx={{
            textAlign: 'center',
            color: error ? statusText.error : verified ? statusText.success : 'text.secondary',
          }}
        >
          {helperText}
        </Typography>
      )}
    </Stack>
  );
}
