import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DesignSystemProvider } from '@/design-system';
import '@fontsource-variable/estedad/wght.css';

export const metadata: Metadata = {
  title: 'هم‌اتاقی | سامانه هوشمند تطبیق هم‌اتاقی خوابگاهی',
  description: 'پیشنهاد هم‌اتاقی سازگار بر اساس عادت‌ها و ترجیحات زندگی مشترک',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <DesignSystemProvider>{children}</DesignSystemProvider>
      </body>
    </html>
  );
}
