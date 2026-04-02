export type BetPick = 'HOME' | 'DRAW' | 'AWAY';

export type BetStatus = 'PENDING' | 'WON' | 'LOST';

export type BetSource = 'seed' | 'user';

export type Bet = {
  id: string;
  matchId: string;
  placedAt: string;
  pick: BetPick;
  odd: number;
  stake: number;
  status: BetStatus;
  return: number | null;
  source: BetSource;
  userId: string;
};
