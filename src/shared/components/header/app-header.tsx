'use client';

import { DepositBalanceDialog } from '@/modules/wallet/presentation/components/deposit-balance-dialog';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';
import { LogOutIcon, UserIcon } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

/**
 * AppHeader displays the top navigation bar.
 * It shows:
 * - brand/logo
 * - user balance
 * - login/logout button depending on session state
 */
export function AppHeader({ currentBalance }: { currentBalance: number }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isAuthenticated = status === 'authenticated';
  const userInitial = session?.user?.email?.charAt(0).toUpperCase() ?? 'U';

  return (
    <header className="border-border/80 bg-surface/95 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-[1380px] flex-wrap items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="flex flex-wrap items-center gap-6">
          <Link
            href="/"
            className="text-brand text-[1.7rem] leading-none font-black"
          >
            BetDayLite
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              data-active={pathname === '/'}
              className={cn(
                'motion-nav-link text-sm font-semibold',
                pathname === '/' ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              Apuestas del dia
            </Link>
            <Link
              href="/profile"
              data-active={pathname === '/profile'}
              className={cn(
                'motion-nav-link text-sm font-semibold',
                pathname === '/profile'
                  ? 'text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              Mis apuestas
            </Link>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          {isAuthenticated ? (
            <DepositBalanceDialog currentBalance={currentBalance} />
          ) : null}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Abrir menu de usuario"
                  className="rounded-full transition-opacity hover:opacity-90"
                >
                  <Avatar
                    size="lg"
                    className="bg-surface-muted shadow-[0_10px_24px_-20px_rgba(15,23,42,0.45)]"
                  >
                    <AvatarFallback className="bg-surface-muted text-foreground font-semibold">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <UserIcon />
                    Mi perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOutIcon />
                  Cerrar sesion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="rounded-full px-5">
              <Link href="/login?callbackUrl=/">Ingresar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
