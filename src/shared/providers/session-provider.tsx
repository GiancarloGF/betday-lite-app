'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { WalletHydrator } from './wallet-hydrator';

/**
 * Client-only wrapper for NextAuth SessionProvider.
 * This is required because React context is not available in Server Components (root layout).
 */
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <WalletHydrator />
      {children}
      <Toaster richColors position="top-right" />
    </SessionProvider>
  );
}
