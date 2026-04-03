import './globals.css';
import '@/shared/styles/animations.scss';

import { AppProviders } from '@/shared/providers/app-providers';
import { rootMetadata } from '@/shared/lib/seo';
import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = rootMetadata;

/**
 * Root layout keeps server rendering enabled while delegating
 * React context providers to a dedicated client component.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
