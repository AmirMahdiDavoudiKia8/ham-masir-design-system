'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { size } from '../tokens';

type StatCardProps = {
  label: string;
  value: ReactNode;
  /** Short context line, e.g. «۲۰٪ کمتر از ترم قبل». */
  helper?: ReactNode;
  icon?: ReactNode;
};

/** A single metric on the dorm-manager dashboard. */
export function StatCard({ label, value, helper, icon }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h1" component="p">
              {value}
            </Typography>
            {helper && (
              <Typography variant="caption" color="text.secondary">
                {helper}
              </Typography>
            )}
          </Stack>
          {icon && (
            <Box
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: size.iconContainer,
                height: size.iconContainer,
                borderRadius: (t) => `${t.radius.lg}px`,
                color: 'primary.main',
                bgcolor: (t) => t.alpha(t.palette.primary.main, 0.1),
              }}
            >
              {icon}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
