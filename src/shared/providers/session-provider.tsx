'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

/**
 * Client-only wrapper for NextAuth SessionProvider.
 * This is required because React context is not available in Server Components (root layout).
 */
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
