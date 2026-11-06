'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { size } from '../tokens';

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
};

/** Shown when a list or page has no content yet (no matches, no students, …). */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', py: 6, px: 3 }}>
      {icon && (
        <Box
          sx={{
            display: 'grid',
            placeItems: 'center',
            width: size.emptyStateIcon,
            height: size.emptyStateIcon,
            borderRadius: '50%',
            bgcolor: (t) => t.alpha(t.palette.primary.main, 0.1),
            color: 'primary.main',
            '& svg': { fontSize: size.icon.xxl },
          }}
        >
          {icon}
        </Box>
      )}
      <Typography variant="h3" component="p">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: size.emptyStateText }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ pt: 1 }}>{action}</Box>}
    </Stack>
  );
}
