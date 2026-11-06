'use client';

import Container, { type ContainerProps } from '@mui/material/Container';
import { layout } from '../tokens';

/** Every page's outer wrapper: consistent max width and vertical padding. */
export function PageContainer({ children, sx, ...props }: ContainerProps) {
  return (
    <Container maxWidth={layout.maxWidth} sx={[{ py: layout.pagePaddingY }, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
      {children}
    </Container>
  );
}
