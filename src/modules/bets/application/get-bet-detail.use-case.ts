import { getUserBets } from './get-user-bets.use-case';

export async function getBetDetail(betId: string) {
  const bets = await getUserBets();

  return bets.find((bet) => bet.id === betId) || null;
}
