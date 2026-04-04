import type { Bet } from '@/modules/bets/domain/bet';
import { SupabaseBetsRepository } from '@/modules/bets/infrastructure/supabase-bets.repository';

type GetUserBetsInput = {
  userId: string;
};

/**
 * Returns all bets for a given application user.
 */
export async function getUserBets(input: GetUserBetsInput): Promise<Bet[]> {
  const repository = new SupabaseBetsRepository();

  return repository.getAllByUserId(input.userId);
}
