import type { BetPick } from '@/modules/bets/domain/bet';

export type PendingBetSummary = {
  id: string;
  placedAt: string;
  pick: BetPick;
  odd: number;
  stake: number;
  matchId: string;
  homeTeamName: string;
  awayTeamName: string;
};
