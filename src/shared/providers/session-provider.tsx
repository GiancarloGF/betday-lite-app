'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

/**
 * Client-only wrapper for NextAuth SessionProvider.
 * This is required because React context is not available in Server Components (root layout).
 */
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster richColors position="top-right" />
    </SessionProvider>
  );
}
