'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/modules/auth/infrastructure/auth.config';
import { getUserBetsUseCase } from '@/modules/bets/application/get-user-bets.use-case';
import type { Bet } from '@/modules/bets/domain/bet';

/**
 * Next.js server action adapter for reading the current user's bets.
 */
export async function getUserBetsAction(): Promise<Bet[]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
  }

  return getUserBetsUseCase({
    userId: session.user.id,
  });
}
