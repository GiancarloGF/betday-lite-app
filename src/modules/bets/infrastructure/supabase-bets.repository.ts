import type {
  Bet,
  BetPick,
  BetSource,
  BetStatus,
} from '@/modules/bets/domain/bet';
import { getSupabaseServerClient } from '@/shared/lib/supabase/server';

type BetRow = {
  id: string;
  user_id: string;
  match_id: string;
  placed_at: string;
  pick: BetPick;
  odd: number;
  stake: number;
  status: BetStatus;
  return_amount: number | null;
  source: BetSource;
};

function mapBetRowToDomain(row: BetRow): Bet {
  return {
    id: row.id,
    userId: row.user_id,
    matchId: row.match_id,
    placedAt: row.placed_at,
    pick: row.pick,
    odd: Number(row.odd),
    stake: Number(row.stake),
    status: row.status,
    return: row.return_amount !== null ? Number(row.return_amount) : null,
    source: row.source,
  };
}

/**
 * Reads bets from Supabase and maps them back to the current domain shape.
 */
export class SupabaseBetsRepository {
  async getAllByUserId(userId: string): Promise<Bet[]> {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('bets')
      .select(
        'id, user_id, match_id, placed_at, pick, odd, stake, status, return_amount, source',
      )
      .eq('user_id', userId)
      .order('placed_at', { ascending: false });

    if (error) {
      throw new Error(
        `Failed to read bets for user ${userId}: ${error.message}`,
      );
    }

    return (data ?? []).map((row) => mapBetRowToDomain(row as BetRow));
  }

  /**
   * Reads a single bet only if it belongs to the given application user.
   */
  async getByIdForUser(userId: string, betId: string): Promise<Bet | null> {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('bets')
      .select(
        'id, user_id, match_id, placed_at, pick, odd, stake, status, return_amount, source',
      )
      .eq('user_id', userId)
      .eq('id', betId)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to read bet ${betId} for user ${userId}: ${error.message}`,
      );
    }

    if (!data) {
      return null;
    }

    return mapBetRowToDomain(data as BetRow);
  }

  async create(input: {
    userId: string;
    matchId: string;
    pick: BetPick;
    odd: number;
    stake: number;
    status: BetStatus;
    returnAmount: number | null;
    source: BetSource;
  }): Promise<Bet> {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('bets')
      .insert({
        user_id: input.userId,
        match_id: input.matchId,
        placed_at: new Date().toISOString(),
        pick: input.pick,
        odd: input.odd,
        stake: input.stake,
        status: input.status,
        return_amount: input.returnAmount,
        source: input.source,
      })
      .select(
        'id, user_id, match_id, placed_at, pick, odd, stake, status, return_amount, source',
      )
      .single();

    if (error || !data) {
      throw new Error(
        `Failed to create bet for user ${input.userId}: ${error?.message ?? 'Bet insert failed'}`,
      );
    }

    return mapBetRowToDomain(data as BetRow);
  }
}
