import { beforeEach, describe, expect, it, vi } from 'vitest';

import { depositBalanceUseCase } from '@/modules/wallet/application/deposit-balance.use-case';
import { SupabaseWalletRepository } from '@/modules/wallet/infrastructure/supabase-wallet.repository';
import { ValidationError } from '@/shared/errors/app-error';

describe('depositBalance', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should increase wallet balance when the amount is valid', async () => {
    vi.spyOn(SupabaseWalletRepository.prototype, 'deposit').mockResolvedValue({
      balance: 50,
      currency: 'PEN',
    });

    const updatedWallet = await depositBalanceUseCase({
      amount: 30,
      userId: 'user-1',
    });

    expect(updatedWallet).toEqual({
      balance: 50,
      currency: 'PEN',
    });
  });

  it('should reject a non-positive amount', async () => {
    await expect(
      depositBalanceUseCase({
        amount: 0,
        userId: 'user-1',
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('should reject an amount with more than 2 decimal places', async () => {
    await expect(
      depositBalanceUseCase({
        amount: 10.555,
        userId: 'user-1',
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});
