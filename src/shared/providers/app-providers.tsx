'use client';

import { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { WalletHydrator } from '@/shared/providers/wallet-hydrator';
import { SessionProvider } from 'next-auth/react';
import { UserBetsHydrator } from './user-bets-hydrator';

/**
 * Composes all global client-side providers of the application.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <WalletHydrator />
      <UserBetsHydrator />
      {children}
      <Toaster richColors position="top-right" />
    </SessionProvider>
  );
}
