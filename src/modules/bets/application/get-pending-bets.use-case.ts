import { getUserBets } from './get-user-bets.use-case';

export async function getPendingBets() {
  const bets = await getUserBets();

  return bets.filter((bet) => bet.status === 'PENDING');
}
