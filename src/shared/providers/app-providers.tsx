'use client';

import { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { SessionProvider } from 'next-auth/react';

/**
 * Composes all global client-side providers of the application.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster richColors position="top-right" />
    </SessionProvider>
  );
}
