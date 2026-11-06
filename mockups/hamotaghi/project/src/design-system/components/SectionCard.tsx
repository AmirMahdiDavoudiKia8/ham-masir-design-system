'use client';

import Card, { type CardProps } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

type SectionCardProps = Omit<CardProps, 'title'> & {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
};

/** A titled card for grouping a section of a page or form. */
export function SectionCard({ title, description, action, children, ...props }: SectionCardProps) {
  return (
    <Card {...props}>
      <CardContent>
        {(title || action) && (
          <Stack direction="row" spacing={2} sx={{ mb: 2.5, alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Stack spacing={0.5}>
              {title && <Typography variant="h3" component="h2">{title}</Typography>}
              {description && (
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              )}
            </Stack>
            {action}
          </Stack>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
