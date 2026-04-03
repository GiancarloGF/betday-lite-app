'use client';

import { DepositBalanceDialog } from '@/modules/wallet/presentation/deposit-balance-dialog';
import { Button } from '@/shared/components/ui/button';
import { useWalletStore } from '@/shared/stores/wallet.store';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

/**
 * AppHeader displays the top navigation bar.
 * It shows:
 * - brand/logo
 * - user balance
 * - login/logout button depending on session state
 */
export function AppHeader() {
  const { status } = useSession();
  const wallet = useWalletStore((state) => state.wallet);

  const isAuthenticated = status === 'authenticated';

  return (
    <header className="border-border bg-surface border-b">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        {/* Logo / Brand */}
        <Link href="/" className="text-brand text-lg font-bold">
          BetDay Lite
        </Link>

        {/* Right section */}
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          {isAuthenticated ? (
            <DepositBalanceDialog currentBalance={wallet.balance} />
          ) : (
            <div className="bg-surface-muted text-foreground rounded-xl px-3 py-2 text-sm font-semibold">
              S/ 0.00
            </div>
          )}

          {/* Auth button */}
          {isAuthenticated ? (
            <Button
              variant="destructive"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Salir
            </Button>
          ) : (
            <Button asChild>
              <Link href="/login?callbackUrl=/">Ingresar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
