import { SupabaseBetsRepository } from '../infrastructure/supabase-bets.repository';
import { SupabaseWalletRepository } from '../../wallet/infrastructure/supabase-wallet.repository';
import { SupabaseMatchesRepository } from '../../matches/infrastructure/supabase-matches.repository';
import { Bet, BetPick } from '../domain/bet';
import {
  InsufficientBalanceError,
  NotFoundError,
} from '@/shared/errors/app-error';
import { validateStake } from '@/shared/validations/bet.validation';

type PlaceBetInput = {
  matchId: string;
  pick: BetPick;
  stake: number;
  userId: string;
};

/**
 * Places a bet for a given match.
 *
 * Responsibilities:
 * - Validate stake constraints
 * - Validate user balance
 * - Freeze selected odd at betting time
 * - Persist bet in Supabase
 * - Deduct balance from the server-authoritative wallet
 */
export async function placeBet(input: PlaceBetInput): Promise<Bet> {
  const { matchId, pick, stake, userId } = input;

  // Validate stake
  validateStake(stake);

  const walletRepo = new SupabaseWalletRepository();
  const wallet = await walletRepo.getByUserId(userId);

  // Validate balance
  if (stake > wallet.balance) {
    throw new InsufficientBalanceError();
  }

  const matchesRepo = new SupabaseMatchesRepository();
  const match = await matchesRepo.getById(matchId);

  if (!match) {
    throw new NotFoundError('Partido no encontrado', 'MATCH_NOT_FOUND');
  }

  // Freeze the selected odd at the moment of placing the bet
  // This ensures the bet is not affected by future odds changes
  const odds =
    pick === 'HOME'
      ? match.market.odds.home
      : pick === 'DRAW'
        ? match.market.odds.draw
        : match.market.odds.away;

  if (!odds) {
    throw new NotFoundError('No se encontró cuota', 'ODD_NOT_FOUND');
  }

  const betsRepo = new SupabaseBetsRepository();
  const bet = await betsRepo.create({
    userId,
    matchId,
    pick,
    odd: odds,
    stake,
    status: 'PENDING',
    returnAmount: null,
    source: 'user',
  });

  await walletRepo.debit(userId, stake);

  return bet;
}
