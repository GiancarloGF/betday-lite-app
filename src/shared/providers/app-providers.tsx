'use client';

import { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { WalletHydrator } from '@/shared/providers/wallet-hydrator';
import { SessionProvider } from 'next-auth/react';

/**
 * Composes all global client-side providers of the application.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <WalletHydrator />
      {children}
      <Toaster richColors position="top-right" />
    </SessionProvider>
  );
}
