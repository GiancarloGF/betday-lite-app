import type { PendingBetSummary } from '@/modules/bets/domain/pending-bet-summary';
import { SupabaseBetsRepository } from '@/modules/bets/infrastructure/supabase-bets.repository';
import { SupabaseMatchesRepository } from '@/modules/matches/infrastructure/supabase-matches.repository';

type GetPendingBetsUseCaseInput = {
  userId: string;
};

/**
 * Returns the current user's pending bets enriched with the minimum match data
 * required by the home sidebar UI.
 */
export async function getPendingBetsUseCase(
  input: GetPendingBetsUseCaseInput,
): Promise<PendingBetSummary[]> {
  const betsRepository = new SupabaseBetsRepository();
  const pendingBets = await betsRepository.getPendingByUserId(input.userId);

  if (pendingBets.length === 0) {
    return [];
  }

  const matchesRepository = new SupabaseMatchesRepository();
  const matchIds = [...new Set(pendingBets.map((bet) => bet.matchId))];
  const matches = await matchesRepository.getByIds(matchIds);
  const matchesById = new Map(matches.map((match) => [match.id, match]));

  return pendingBets.map((bet) => {
    const match = matchesById.get(bet.matchId);

    return {
      id: bet.id,
      placedAt: bet.placedAt,
      pick: bet.pick,
      odd: bet.odd,
      stake: bet.stake,
      matchId: bet.matchId,
      homeTeamName: match?.homeTeam.name ?? 'Equipo local',
      awayTeamName: match?.awayTeam.name ?? 'Equipo visitante',
    };
  });
}
