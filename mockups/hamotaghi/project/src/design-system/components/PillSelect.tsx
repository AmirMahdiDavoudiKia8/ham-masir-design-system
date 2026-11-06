'use client';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { type SelectProps } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useId, type ReactNode } from 'react';
import { controlHeight } from '../tokens';

type PillSelectProps = Omit<SelectProps, 'label' | 'labelId'> & {
  label: string;
  helperText?: ReactNode;
};

/**
 * The select counterpart of `PillField`: same label-above layout and the same
 * capsule outline, so a select can sit next to a text field without looking
 * like a stock MUI control.
 */
export function PillSelect({ label, helperText, id, children, ...props }: PillSelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const labelId = `${selectId}-label`;

  return (
    <FormControl>
      <Typography id={labelId} component="label" variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Select
        id={selectId}
        labelId={labelId}
        input={<OutlinedInput sx={{ minHeight: controlHeight.large, typography: 'body1' }} />}
        aria-describedby={helperText ? `${selectId}-helper` : undefined}
        {...props}
      >
        {children}
      </Select>
      {helperText && <FormHelperText id={`${selectId}-helper`}>{helperText}</FormHelperText>}
    </FormControl>
  );
}
