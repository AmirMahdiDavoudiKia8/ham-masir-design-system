'use client';

import Chip, { type ChipProps } from '@mui/material/Chip';
import { statusStroke, statusText } from '../tokens';

export type MatchStatus = 'pending' | 'waitingOther' | 'accepted' | 'rejected' | 'locked';

type StatusMeta =
  | { label: string; role: keyof typeof statusText }
  | { label: string; role: 'locked' };

const statusMap: Record<MatchStatus, StatusMeta> = {
  pending: { label: 'در انتظار پاسخ شما', role: 'warning' },
  waitingOther: { label: 'در انتظار طرف مقابل', role: 'info' },
  accepted: { label: 'تأیید دوطرفه', role: 'success' },
  rejected: { label: 'رد شده', role: 'error' },
  locked: { label: 'قفل شده', role: 'locked' },
};

/**
 * Status of a suggested match (F5.2). Labels, text colors and stroke colors
 * live here only; text uses the AA-safe `statusText` roles and the outline
 * uses the 3:1 `statusStroke` roles.
 */
export function StatusChip({ status, sx, ...props }: { status: MatchStatus } & Omit<ChipProps, 'label' | 'color'>) {
  const meta = statusMap[status];
  const accessibleSx =
    meta.role === 'locked'
      ? { color: 'text.secondary', borderColor: 'divider' }
      : { color: statusText[meta.role], borderColor: statusStroke[meta.role] };

  return (
    <Chip
      size="small"
      variant="outlined"
      label={meta.label}
      sx={[accessibleSx, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  );
}
