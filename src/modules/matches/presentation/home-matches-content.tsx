import { headers } from 'next/headers';

import type { Match } from '@/modules/matches/domain/match';
import { HomeMatchesSection } from '@/modules/matches/presentation/home-matches-section';
import type { ApiSuccessResponse } from '@/shared/types/api';

function resolveBaseUrl(requestHeaders: Headers): string {
  const host =
    requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');

  const protocol =
    requestHeaders.get('x-forwarded-proto') ??
    (host?.includes('localhost') ? 'http' : 'https');

  if (!host) {
    throw new Error('Unable to resolve request host');
  }

  return `${protocol}://${host}`;
}

async function getMatches(): Promise<Match[]> {
  const requestHeaders = await headers();
  const baseUrl = resolveBaseUrl(requestHeaders);

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
