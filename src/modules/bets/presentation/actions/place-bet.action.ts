'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/modules/auth/infrastructure/auth.config';
import { placeBetUseCase } from '@/modules/bets/application/place-bet.use-case';
import type { Bet, BetPick } from '@/modules/bets/domain/bet';
import { ValidationError } from '@/shared/errors/app-error';

type PlaceBetActionResult =
  | {
      ok: true;
      bet: Bet;
    }
  | {
      ok: false;
      errorMessage: string;
    };

/**
 * Next.js server action adapter for the place bet use case.
 */
export async function placeBetAction(input: {
  matchId: string;
  pick: BetPick;
  stake: number;
}): Promise<PlaceBetActionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new ValidationError(
        'Debes iniciar sesión para registrar una apuesta',
      );
    }

    const bet = await placeBetUseCase({
      matchId: input.matchId,
      pick: input.pick,
      stake: input.stake,
      userId: session.user.id,
    });

    return {
      ok: true,
      bet,
    };
  } catch (error) {
    return {
      ok: false,
      errorMessage:
        error instanceof Error
          ? error.message
          : 'No se pudo registrar la apuesta',
    };
  }
}
