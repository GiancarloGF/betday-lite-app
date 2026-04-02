import { LocalStorageWalletRepository } from '../infrastructure/local-storage-wallet.repository';

export function getBalance() {
  const repo = new LocalStorageWalletRepository();

  return repo.get();
}
