import { getUserBetsAction } from '@/modules/bets/presentation/actions/get-user-bets.action';
import { BetsHistorySection } from '@/modules/bets/presentation/components/bets-history-section';
import { getTodayMatchesAction } from '@/modules/matches/presentation/actions/get-today-matches.action';

/**
 * Server component for the profile bets history section.
 */
export async function ProfileBetsHistoryContent() {
  const [bets, matches] = await Promise.all([
    getUserBetsAction(),
    getTodayMatchesAction(),
  ]);

  return <BetsHistorySection bets={bets} matches={matches} />;
}
