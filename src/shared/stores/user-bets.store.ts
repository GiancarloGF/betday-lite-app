'use client';

import { create } from 'zustand';

import type { Bet } from '@/modules/bets/domain/bet';
import { LocalStorageBetsRepository } from '@/modules/bets/infrastructure/local-storage-bets.repository';

type UserBetsStore = {
  userBets: Bet[];
  refreshUserBets: () => void;
  addUserBet: (bet: Bet) => void;
};

function readUserBetsFromStorage(): Bet[] {
  const repository = new LocalStorageBetsRepository();
  return repository.getAll();
}

/**
 * Stores user-created bets that are persisted in localStorage.
 */
export const useUserBetsStore = create<UserBetsStore>((set) => ({
  userBets: [],

  /**
   * Loads persisted user bets into the client store.
   */
  refreshUserBets: () => {
    const userBets = readUserBetsFromStorage();
    set({ userBets });
  },

  /**
   * Adds a newly created user bet to the in-memory store.
   */
  addUserBet: (bet) => {
    set((state) => ({
      userBets: [bet, ...state.userBets],
    }));
  },
}));
