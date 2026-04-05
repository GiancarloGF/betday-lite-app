import { getTodayMatchesAction } from '@/modules/matches/presentation/actions/get-today-matches.action';
import { HomeMatchesSection } from '@/modules/matches/presentation/components/home-matches-section';

/**
 * Server component for the home matches column.
 */
export async function HomeMatchesSectionContent() {
  const matches = await getTodayMatchesAction();

  return <HomeMatchesSection matches={matches} />;
}
