import { describe, expect, it, beforeEach, vi } from 'vitest';

import { placeBetUseCase } from '@/modules/bets/application/place-bet.use-case';
import { SupabaseBetsRepository } from '@/modules/bets/infrastructure/supabase-bets.repository';
import { SupabaseMatchesRepository } from '@/modules/matches/infrastructure/supabase-matches.repository';
import { SupabaseWalletRepository } from '@/modules/wallet/infrastructure/supabase-wallet.repository';
import {
  ValidationError,
  InsufficientBalanceError,
} from '@/shared/errors/app-error';

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(SupabaseWalletRepository.prototype, 'getByUserId').mockResolvedValue(
    {
      balance: 100,
      currency: 'PEN',
    },
  );
  vi.spyOn(SupabaseMatchesRepository.prototype, 'getById').mockResolvedValue({
    id: 'match_001',
    startTime: '2026-02-12T00:00:00-05:00',
    league: {
      id: 'premier_league',
      name: 'Premier League',
      country: 'England',
    },
    homeTeam: {
      id: 'bha',
      name: 'Brighton',
      shortName: 'BHA',
    },
    awayTeam: {
      id: 'bre',
      name: 'Brentford',
      shortName: 'BRE',
    },
    market: {
      type: '1X2',
      odds: {
        home: 4.67,
        draw: 4.44,
        away: 5.96,
      },
    },
  });
  vi.spyOn(SupabaseWalletRepository.prototype, 'debit').mockResolvedValue({
    balance: 90,
    currency: 'PEN',
  });
});

describe('placeBet', () => {
  it('should create a pending bet with the frozen odd for the selected pick', async () => {
    vi.spyOn(SupabaseBetsRepository.prototype, 'create').mockResolvedValue({
      id: 'bet-test-id',
      matchId: 'match_001',
      placedAt: '2026-02-12T00:00:00-05:00',
      pick: 'HOME',
      odd: 4.67,
      stake: 10,
      status: 'PENDING',
      return: null,
      source: 'user',
      userId: 'demo-user',
    });

    const bet = await placeBetUseCase({
      matchId: 'match_001',
      pick: 'HOME',
      stake: 10,
      userId: 'demo-user',
    });

    expect(bet).toMatchObject({
      id: 'bet-test-id',
      matchId: 'match_001',
      pick: 'HOME',
      odd: 4.67,
      stake: 10,
      status: 'PENDING',
      return: null,
      source: 'user',
      userId: 'demo-user',
    });
  });

  it('should persist the newly created bet in Supabase', async () => {
    const createSpy = vi
      .spyOn(SupabaseBetsRepository.prototype, 'create')
      .mockResolvedValue({
        id: 'bet-test-id',
        matchId: 'match_002',
        placedAt: '2026-02-12T00:30:00-05:00',
        pick: 'AWAY',
        odd: 5.35,
        stake: 20,
        status: 'PENDING',
        return: null,
        source: 'user',
        userId: 'demo-user',
      });
    vi.spyOn(SupabaseMatchesRepository.prototype, 'getById').mockResolvedValue({
      id: 'match_002',
      startTime: '2026-02-12T00:30:00-05:00',
      league: {
        id: 'premier_league',
        name: 'Premier League',
        country: 'England',
      },
      homeTeam: {
        id: 'tot',
        name: 'Tottenham',
        shortName: 'TOT',
      },
      awayTeam: {
        id: 'whu',
        name: 'West Ham',
        shortName: 'WHU',
      },
      market: {
        type: '1X2',
        odds: {
          home: 1.63,
          draw: 4.34,
          away: 5.35,
        },
      },
    });

    await placeBetUseCase({
      matchId: 'match_002',
      pick: 'AWAY',
      stake: 20,
      userId: 'demo-user',
    });

    expect(createSpy).toHaveBeenCalledWith({
      userId: 'demo-user',
      matchId: 'match_002',
      pick: 'AWAY',
      odd: 5.35,
      stake: 20,
      status: 'PENDING',
      returnAmount: null,
      source: 'user',
    });
  });

  it('should debit the wallet after placing a valid bet', async () => {
    const debitSpy = vi
      .spyOn(SupabaseWalletRepository.prototype, 'debit')
      .mockResolvedValue({
        balance: 85,
        currency: 'PEN',
      });
    vi.spyOn(SupabaseBetsRepository.prototype, 'create').mockResolvedValue({
      id: 'bet-test-id',
      matchId: 'match_003',
      placedAt: '2026-02-12T01:00:00-05:00',
      pick: 'DRAW',
      odd: 3.94,
      stake: 15,
      status: 'PENDING',
      return: null,
      source: 'user',
      userId: 'demo-user',
    });

    await placeBetUseCase({
      matchId: 'match_003',
      pick: 'DRAW',
      stake: 15,
      userId: 'demo-user',
    });

    expect(debitSpy).toHaveBeenCalledWith('demo-user', 15);
  });

  it('should reject a stake lower than the minimum allowed', async () => {
    await expect(
      placeBetUseCase({
        matchId: 'match_001',
        pick: 'HOME',
        stake: 0.5,
        userId: 'demo-user',
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('should reject a stake with more than 2 decimal places', async () => {
    await expect(
      placeBetUseCase({
        matchId: 'match_001',
        pick: 'HOME',
        stake: 10.123,
        userId: 'demo-user',
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('should reject a bet when the user has insufficient balance', async () => {
    vi.spyOn(
      SupabaseWalletRepository.prototype,
      'getByUserId',
    ).mockResolvedValue({
      balance: 5,
      currency: 'PEN',
    });

    await expect(
      placeBetUseCase({
        matchId: 'match_001',
        pick: 'HOME',
        stake: 10,
        userId: 'demo-user',
      }),
    ).rejects.toBeInstanceOf(InsufficientBalanceError);
  });
});
