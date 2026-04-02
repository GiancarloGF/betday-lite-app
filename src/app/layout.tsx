import './globals.css';

import { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthSessionProvider } from '@/shared/providers/session-provider';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * Root layout keeps server rendering enabled while delegating
 * React context providers to a dedicated client component.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
