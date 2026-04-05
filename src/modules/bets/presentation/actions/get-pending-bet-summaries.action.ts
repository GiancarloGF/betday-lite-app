'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/modules/auth/infrastructure/auth.config';
import type { PendingBetSummary } from '@/modules/bets/domain/pending-bet-summary';
import { getPendingBetsUseCase } from '@/modules/bets/application/get-pending-bet-summaries.use-case';

/**
 * Next.js server action adapter for reading the current user's pending bets.
 */
export async function getPendingBetsAction(): Promise<PendingBetSummary[]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
  }

  return getPendingBetsUseCase({
    userId: session.user.id,
  });
}
