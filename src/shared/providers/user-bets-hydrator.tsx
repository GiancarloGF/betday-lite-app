'use client';

import { useEffect } from 'react';

import { useUserBetsStore } from '@/shared/stores/user-bets.store';

/**
 * Loads persisted user bets into the client store after hydration.
 */
export function UserBetsHydrator() {
  const refreshUserBets = useUserBetsStore((state) => state.refreshUserBets);

  useEffect(() => {
    refreshUserBets();
  }, [refreshUserBets]);

  return null;
}
