'use client';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { faDigits } from '../digits';
import { matchScoreLevels, size, statusStroke, statusText } from '../tokens';

export function getMatchLevel(score: number) {
  return matchScoreLevels.find((level) => score >= level.min) ?? matchScoreLevels[matchScoreLevels.length - 1];
}

const sizes = {
  small: { ...size.matchScore.small, variant: 'caption' },
  medium: { ...size.matchScore.medium, variant: 'h3' },
  large: { ...size.matchScore.large, variant: 'h1' },
} as const;

type MatchScoreProps = {
  /** Compatibility score, 0–100. */
  score: number;
  size?: keyof typeof sizes;
};

/** Circular compatibility percentage. Color comes from `matchScoreLevels` in tokens — never pick it by hand. */
export function MatchScore({ score, size = 'medium' }: MatchScoreProps) {
  const value = Math.max(0, Math.min(100, Math.round(score)));
  const level = getMatchLevel(value);
  const s = sizes[size];

  return (
    <Box
      role="img"
      aria-label={`${level.label}، ${faDigits(value)} درصد`}
      sx={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: s.box, height: s.box, flexShrink: 0 }}
    >
      <CircularProgress
        variant="determinate"
        value={100}
        size={s.box}
        thickness={s.thickness}
        sx={{ position: 'absolute', color: 'divider' }}
      />
      <CircularProgress
        variant="determinate"
        value={value}
        size={s.box}
        thickness={s.thickness}
        sx={{ position: 'absolute', color: statusStroke[level.role], '& circle': { strokeLinecap: 'round' } }}
      />
      <Typography variant={s.variant} component="span" sx={{ fontWeight: 'fontWeightBold', color: statusText[level.role] }}>
        {faDigits(value)}٪
      </Typography>
    </Box>
  );
}
