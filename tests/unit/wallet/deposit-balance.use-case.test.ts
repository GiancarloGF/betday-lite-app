import { describe, expect, it } from 'vitest';

import { depositBalance } from '@/modules/wallet/application/deposit-balance.use-case';
import { LocalStorageWalletRepository } from '@/modules/wallet/infrastructure/local-storage-wallet.repository';
import { ValidationError } from '@/shared/errors/app-error';

describe('depositBalance', () => {
  it('should increase wallet balance when the amount is valid', () => {
    const walletRepository = new LocalStorageWalletRepository();

    walletRepository.save({
      balance: 20,
      currency: 'PEN',
    });

    const updatedWallet = depositBalance(30);

    expect(updatedWallet).toEqual({
      balance: 50,
      currency: 'PEN',
    });
  });

  it('should reject a non-positive amount', () => {
    expect(() => depositBalance(0)).toThrow(ValidationError);
  });

  it('should reject an amount with more than 2 decimal places', () => {
    expect(() => depositBalance(10.555)).toThrow(ValidationError);
  });
});
