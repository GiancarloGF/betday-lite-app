import type { BetPick, BetStatus } from '@/modules/bets/domain/bet';
import betsData from '@/shared/data/bets.me.50.json';

type SeedBetInsert = {
  user_id: string;
  match_id: string;
  placed_at: string;
  pick: BetPick;
  odd: number;
  stake: number;
  status: BetStatus;
  return_amount: number | null;
  source: 'seed';
  created_at: string;
  updated_at: string;
};

/**
 * Maps the static seed dataset to database rows for a specific user.
 */
export function mapSeedBetsForUser(
  userId: string,
  now: string,
): SeedBetInsert[] {
  return betsData.bets.map((bet) => ({
    user_id: userId,
    match_id: bet.matchId,
    placed_at: bet.placedAt,
    pick: bet.pick as BetPick,
    odd: bet.odd,
    stake: bet.stake,
    status: bet.status as BetStatus,
    return_amount: bet.return,
    source: 'seed',
    created_at: now,
    updated_at: now,
  }));
}
