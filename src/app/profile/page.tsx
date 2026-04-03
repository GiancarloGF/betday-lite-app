import { authOptions } from '@/modules/auth/infrastructure/auth.config';
import type { Bet } from '@/modules/bets/domain/bet';
import { BetsHistorySection } from '@/modules/bets/presentation/bets-history-section';
import type { Match } from '@/modules/matches/domain/match';
import { AppShell } from '@/shared/components/layout/app-shell';
import { getBaseUrl } from '@/shared/lib/get-base-url';
import { createPageMetadata } from '@/shared/lib/seo';
import type { ApiSuccessResponse } from '@/shared/types/api';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = createPageMetadata({
  title: 'Mis apuestas',
  description: 'Consulta tu historial y el estado de tus apuestas.',
  path: '/profile',
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
 * Renders the private profile page with the user's bet history.
 */
export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const [seedBets, matches] = await Promise.all([getSeedBets(), getMatches()]);

  return (
    <AppShell>
      <div className="space-y-7">
        <div className="space-y-3">
          <p className="text-brand text-sm font-semibold tracking-[0.24em] uppercase">
            Profile
          </p>
          <h1 className="text-foreground text-4xl leading-tight font-semibold tracking-tight">
            Mis apuestas
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base">
            Revisa tu historial de apuestas y filtra por estado.
          </p>
        </div>

        <BetsHistorySection seedBets={seedBets} matches={matches} />
      </div>
    </AppShell>
  );
}
