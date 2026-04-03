import type { Match } from '@/modules/matches/domain/match';
import { HomeMatchesSection } from '@/modules/matches/presentation/home-matches-section';
import { getBaseUrl } from '@/shared/lib/get-base-url';
import type { ApiSuccessResponse } from '@/shared/types/api';

async function getMatches(): Promise<Match[]> {
  const baseUrl = await getBaseUrl();

  const response = await fetch(`${baseUrl}/api/matches`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch matches');
  }

  const payload = (await response.json()) as ApiSuccessResponse<Match[]>;

  return payload.data;
}

/**
 * Fetches matches and renders the interactive home section.
 */
export async function HomeMatchesContent() {
  const matches = await getMatches();

  return <HomeMatchesSection matches={matches} />;
}
