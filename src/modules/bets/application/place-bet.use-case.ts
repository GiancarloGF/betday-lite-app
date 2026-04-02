import { LocalStorageBetsRepository } from '../infrastructure/local-storage-bets.repository';
import { LocalStorageWalletRepository } from '../../wallet/infrastructure/local-storage-wallet.repository';
import { JsonMatchesRepository } from '../../matches/infrastructure/json-matches.repository';
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
 * - Persist bet in local storage
 * - Deduct balance from wallet
 */
export async function placeBet(input: PlaceBetInput): Promise<Bet> {
  const { matchId, pick, stake, userId } = input;

  // Validate stake
  validateStake(stake);

  const walletRepo = new LocalStorageWalletRepository();
  const wallet = walletRepo.get();

  // Validate balance
  if (stake > wallet.balance) {
    throw new InsufficientBalanceError();
  }

  const matchesRepo = new JsonMatchesRepository();
  const matches = await matchesRepo.getTodayMatches();

  const match = matches.find((m) => m.id === matchId);

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

  // Create bet object
  const bet: Bet = {
    id: crypto.randomUUID(),
    matchId,
    placedAt: new Date().toISOString(),
    pick,
    odd: odds,
    stake,
    status: 'PENDING',
    return: null,
    source: 'user',
    userId,
  };

  const betsRepo = new LocalStorageBetsRepository();

  // Persist bet
  betsRepo.create(bet);

  // Deduct stake from wallet after successful bet creation
  walletRepo.debit(stake);

  return bet;
}
