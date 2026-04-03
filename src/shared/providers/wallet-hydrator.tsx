'use client';

import { useEffect } from 'react';

import { useWalletStore } from '@/shared/stores/wallet.store';

/**
 * Loads persisted wallet data into the client store after hydration.
 */
export function WalletHydrator() {
  const refreshWallet = useWalletStore((state) => state.refreshWallet);

  useEffect(() => {
    refreshWallet();
  }, [refreshWallet]);

  return null;
}
