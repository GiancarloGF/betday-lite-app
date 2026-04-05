'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/modules/auth/infrastructure/auth.config';
import type { Wallet } from '@/modules/wallet/domain/wallet';
import { getBalanceUseCase } from '@/modules/wallet/application/get-balance.use-case';

/**
 * Next.js server action adapter for reading the current user's wallet.
 */
export async function getBalanceAction(): Promise<Wallet | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  return getBalanceUseCase({
    userId: session.user.id,
  });
}
