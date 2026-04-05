import type { Bet } from '@/modules/bets/domain/bet';
import { SupabaseBetsRepository } from '@/modules/bets/infrastructure/supabase-bets.repository';
import type { Match } from '@/modules/matches/domain/match';
import { SupabaseMatchesRepository } from '@/modules/matches/infrastructure/supabase-matches.repository';

type GetBetDetailInput = {
  betId: string;
  userId: string;
};

type BetDetailResult = {
  bet: Bet | null;
  match: Match | null;
};

/**
 * Returns a user-owned bet and its related match.
 */
export async function getBetDetailUseCase(
  input: GetBetDetailInput,
): Promise<BetDetailResult> {
  const betsRepository = new SupabaseBetsRepository();
  const bet = await betsRepository.getByIdForUser(input.userId, input.betId);

  if (!bet) {
    return {
      bet: null,
      match: null,
    };
  }

  const matchesRepository = new SupabaseMatchesRepository();
  const match = await matchesRepository.getById(bet.matchId);

  return {
    bet,
    match,
  };
}
