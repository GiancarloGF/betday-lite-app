'use client';

import { useCallback, useEffect, useState } from 'react';

import { LocalStorageWalletRepository } from '@/modules/wallet/infrastructure/local-storage-wallet.repository';
import type { Wallet } from '@/modules/wallet/domain/wallet';

const DEFAULT_WALLET: Wallet = {
  balance: 0,
  currency: 'PEN',
};

const repository = new LocalStorageWalletRepository();

function readWallet(): Wallet {
  return repository.get();
}

/**
 * Reads wallet data from localStorage and exposes a refresh function
 * so UI components can stay in sync after deposits or bets.
 */
export function useWallet() {
  const [wallet, setWallet] = useState<Wallet>(() => readWallet());

  const refreshWallet = useCallback(() => {
    setWallet(readWallet());
  }, []);

  useEffect(() => {
    function handleWalletUpdated() {
      refreshWallet();
    }

    window.addEventListener('wallet:updated', handleWalletUpdated);

    return () => {
      window.removeEventListener('wallet:updated', handleWalletUpdated);
    };
  }, [refreshWallet]);

  return {
    wallet,
    refreshWallet,
  };
}
