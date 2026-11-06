'use client';

import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { size, statusStroke } from '../tokens';
import { MatchScore } from './MatchScore';
import { StatusChip, type MatchStatus } from './StatusChip';

type MatchCardProps = {
  /** Partially hidden display name, e.g. «سارا م.» (F1.4). */
  name: string;
  /** e.g. «مهندسی کامپیوتر · ورودی ۱۴۰۴» */
  meta?: string;
  score: number;
  /** Why this person was suggested (F4.5). */
  agreements: string[];
  /** Differences the algorithm considers manageable. */
  differences?: string[];
  status?: MatchStatus;
  onAccept?: () => void;
  onReject?: () => void;
};

function ReasonList({ items, tone }: { items: string[]; tone: 'success' | 'warning' }) {
  const Icon = tone === 'success' ? CheckCircleRounded : ErrorOutlineRounded;
  return (
    <Stack component="ul" spacing={1} sx={{ m: 0, p: 0, listStyle: 'none' }}>
      {items.map((item) => (
        <Stack component="li" key={item} direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
          <Icon fontSize="small" sx={{ mt: 0.25, color: statusStroke[tone] }} />
          <Typography variant="body2">{item}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}

/** A suggested roommate with score, explanation and accept / reject actions (F5.1, F5.2). */
export function MatchCard({ name, meta, score, agreements, differences = [], status, onAccept, onReject }: MatchCardProps) {
  const canRespond = !status || status === 'pending';

  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar sx={{ width: size.avatar.md, height: size.avatar.md, bgcolor: 'primary.main' }}>
            {name.trim().charAt(0)}
          </Avatar>
          <Stack sx={{ flex: 1, minWidth: 0 }} spacing={0.25}>
            <Typography variant="h3" noWrap>
              {name}
            </Typography>
            {meta && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {meta}
              </Typography>
            )}
            {status && <StatusChip status={status} sx={{ alignSelf: 'flex-start', mt: 0.5 }} />}
          </Stack>
          <MatchScore score={score} />
        </Stack>

        <Divider sx={{ my: 2.5 }} />

        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              چرا پیشنهاد شد
            </Typography>
            <ReasonList items={agreements} tone="success" />
          </Stack>
          {differences.length > 0 && (
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                تفاوت‌های قابل مدیریت
              </Typography>
              <ReasonList items={differences} tone="warning" />
            </Stack>
          )}
        </Stack>
      </CardContent>

      {canRespond && (onAccept || onReject) && (
        <CardActions>
          {onAccept && (
            <Button variant="contained" color="secondary" onClick={onAccept} sx={{ flex: 1 }}>
              تأیید هم‌اتاقی
            </Button>
          )}
          {onReject && (
            <Button variant="outlined" color="inherit" onClick={onReject} sx={{ flex: 1 }}>
              رد پیشنهاد
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
}
