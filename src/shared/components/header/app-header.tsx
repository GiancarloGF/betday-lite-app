'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

/**
 * AppHeader displays the top navigation bar.
 * It shows:
 * - brand/logo
 * - user balance
 * - login/logout button depending on session state
 */
export function AppHeader() {
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';

  return (
    <header className="border-border bg-surface border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo / Brand */}
        <div className="text-brand text-lg font-bold">BetDay Lite</div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Wallet (placeholder for now) */}
          <div className="bg-surface-muted rounded-lg px-3 py-1 text-sm font-medium">
            S/ 0.00
          </div>

          {/* Auth button */}
          {isAuthenticated ? (
            <Button variant="destructive" onClick={() => signOut()}>
              Salir
            </Button>
          ) : (
            <Button onClick={() => signIn(undefined, { callbackUrl: '/' })}>
              Ingresar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
