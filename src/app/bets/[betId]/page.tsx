import { getServerSession } from 'next-auth';

import { authOptions } from '@/modules/auth/infrastructure/auth.config';
import type { Bet } from '@/modules/bets/domain/bet';
import { BetDetailSection } from '@/modules/bets/presentation/bet-detail-section';
import type { Match } from '@/modules/matches/domain/match';
import { AppShell } from '@/shared/components/layout/app-shell';
import { getBaseUrl } from '@/shared/lib/get-base-url';
import { createPageMetadata } from '@/shared/lib/seo';
import type { ApiSuccessResponse } from '@/shared/types/api';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ betId: string }>;
};

export const metadata: Metadata = createPageMetadata({
  title: 'Detalle de apuesta',
  description: 'Detalle privado de una apuesta realizada por el usuario.',
  path: '/bets',
  index: false,
});

async function getSeedBets(): Promise<Bet[]> {
  const baseUrl = await getBaseUrl();

  const response = await fetch(`${baseUrl}/api/bets`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch bets');
  }

  const payload = (await response.json()) as ApiSuccessResponse<Bet[]>;

  return payload.data;
}

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
 * Renders the bet detail page.
 */
export default async function BetDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const { betId } = await params;

  const [seedBets, matches] = await Promise.all([getSeedBets(), getMatches()]);

  return (
    <AppShell>
      <BetDetailSection betId={betId} seedBets={seedBets} matches={matches} />
    </AppShell>
  );
}
