'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/modules/auth/infrastructure/auth.config';
import { getBetDetailUseCase } from '@/modules/bets/application/get-bet-detail.use-case';
import type { Bet } from '@/modules/bets/domain/bet';
import type { Match } from '@/modules/matches/domain/match';

type BetDetailActionResult = {
  bet: Bet | null;
  match: Match | null;
};

/**
 * Next.js server action adapter for reading a user-owned bet detail.
 */
export async function getBetDetailAction(
  betId: string,
): Promise<BetDetailActionResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      bet: null,
      match: null,
    };
  }

  return getBetDetailUseCase({
    betId,
    userId: session.user.id,
  });
}
