import { describe, expect, it, beforeEach, vi } from 'vitest';

import { placeBet } from '@/modules/bets/application/place-bet.use-case';
import { LocalStorageBetsRepository } from '@/modules/bets/infrastructure/local-storage-bets.repository';
import { LocalStorageWalletRepository } from '@/modules/wallet/infrastructure/local-storage-wallet.repository';
import {
  ValidationError,
  InsufficientBalanceError,
} from '@/shared/errors/app-error';

/**
 * Mocks crypto.randomUUID for deterministic test results.
 */
beforeEach(() => {
  vi.stubGlobal('crypto', {
    randomUUID: () => 'bet-test-id',
  });
});

describe('placeBet', () => {
  it('should create a pending bet with the frozen odd for the selected pick', async () => {
    const walletRepository = new LocalStorageWalletRepository();

    walletRepository.save({
      balance: 100,
      currency: 'PEN',
    });

    const bet = await placeBet({
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

  it('should persist the newly created bet in localStorage', async () => {
    const walletRepository = new LocalStorageWalletRepository();

    walletRepository.save({
      balance: 100,
      currency: 'PEN',
    });

    await placeBet({
      matchId: 'match_002',
      pick: 'AWAY',
      stake: 20,
      userId: 'demo-user',
    });

    const betsRepository = new LocalStorageBetsRepository();

    const storedBets = betsRepository.getAll();

    expect(storedBets).toHaveLength(1);
    expect(storedBets[0]).toMatchObject({
      id: 'bet-test-id',
      matchId: 'match_002',
      pick: 'AWAY',
      odd: 5.35,
      stake: 20,
    });
  });

  it('should debit the wallet after placing a valid bet', async () => {
    const walletRepository = new LocalStorageWalletRepository();

    walletRepository.save({
      balance: 100,
      currency: 'PEN',
    });

    await placeBet({
      matchId: 'match_003',
      pick: 'DRAW',
      stake: 15,
      userId: 'demo-user',
    });

    const updatedWallet = walletRepository.get();

    expect(updatedWallet.balance).toBe(85);
  });

  it('should reject a stake lower than the minimum allowed', async () => {
    const walletRepository = new LocalStorageWalletRepository();

    walletRepository.save({
      balance: 100,
      currency: 'PEN',
    });

    await expect(
      placeBet({
        matchId: 'match_001',
        pick: 'HOME',
        stake: 0.5,
        userId: 'demo-user',
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('should reject a stake with more than 2 decimal places', async () => {
    const walletRepository = new LocalStorageWalletRepository();

    walletRepository.save({
      balance: 100,
      currency: 'PEN',
    });

    await expect(
      placeBet({
        matchId: 'match_001',
        pick: 'HOME',
        stake: 10.123,
        userId: 'demo-user',
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('should reject a bet when the user has insufficient balance', async () => {
    const walletRepository = new LocalStorageWalletRepository();

    walletRepository.save({
      balance: 5,
      currency: 'PEN',
    });

    await expect(
      placeBet({
        matchId: 'match_001',
        pick: 'HOME',
        stake: 10,
        userId: 'demo-user',
      }),
    ).rejects.toBeInstanceOf(InsufficientBalanceError);
  });
});
