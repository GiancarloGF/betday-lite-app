'use client';

import { create } from 'zustand';

import { depositBalance } from '@/modules/wallet/application/deposit-balance.use-case';
import type { Wallet } from '@/modules/wallet/domain/wallet';
import { LocalStorageWalletRepository } from '@/modules/wallet/infrastructure/local-storage-wallet.repository';

type WalletStore = {
  wallet: Wallet;
  refreshWallet: () => void;
  depositToWallet: (amount: number) => Wallet;
};

const DEFAULT_WALLET: Wallet = {
  balance: 0,
  currency: 'PEN',
};

function readWalletFromStorage(): Wallet {
  const repository = new LocalStorageWalletRepository();
  return repository.get();
}

/**
 * Stores wallet data that is shared by multiple client components.
 */
export const useWalletStore = create<WalletStore>((set) => ({
  wallet: DEFAULT_WALLET,

  /**
   * Re-syncs wallet state from localStorage.
   */
  refreshWallet: () => {
    const wallet = readWalletFromStorage();
    set({ wallet });
  },

  /**
   * Deposits money using the wallet use case and updates the store.
   */
  depositToWallet: (amount: number) => {
    const wallet = depositBalance(amount);
    set({ wallet });
    return wallet;
  },
}));
