import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getBalanceUseCase } from '@/modules/wallet/application/get-balance.use-case';
import { SupabaseWalletRepository } from '@/modules/wallet/infrastructure/supabase-wallet.repository';

describe('getBalance', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the current wallet from the repository', async () => {
    const getByUserIdSpy = vi
      .spyOn(SupabaseWalletRepository.prototype, 'getByUserId')
      .mockResolvedValue({
        balance: 125,
        currency: 'PEN',
      });

    const wallet = await getBalanceUseCase({
      userId: 'user-1',
    });

    expect(getByUserIdSpy).toHaveBeenCalledWith('user-1');
    expect(wallet).toEqual({
      balance: 125,
      currency: 'PEN',
    });
  });
});
