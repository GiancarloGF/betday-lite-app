import { LocalStorageWalletRepository } from '../infrastructure/local-storage-wallet.repository';
import { validateDepositAmount } from '@/shared/validations/wallet.validation';

export function depositBalance(amount: number) {
  validateDepositAmount(amount);

  const repo = new LocalStorageWalletRepository();

  return repo.deposit(amount);
}
