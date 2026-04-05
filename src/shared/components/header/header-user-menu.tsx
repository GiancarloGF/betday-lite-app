'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { LogOutIcon, UserIcon } from 'lucide-react';

import { DepositBalanceDialog } from '@/modules/wallet/presentation/components/deposit-balance-dialog';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

type HeaderUserMenuProps = {
  currentBalance: number;
  userInitial: string;
};

/**
 * Minimal client-only island for authenticated header interactions.
 */
export function HeaderUserMenu({
  currentBalance,
  userInitial,
}: HeaderUserMenuProps) {
  return (
    <>
      <DepositBalanceDialog currentBalance={currentBalance} />

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
    </>
  );
}
