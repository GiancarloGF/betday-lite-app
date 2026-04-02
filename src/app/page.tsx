import type { Match } from '@/modules/matches/domain/match';
import { MatchesList } from '@/modules/matches/presentation/matches-list';
import { AppShell } from '@/shared/components/layout/app-shell';
import { env } from '@/shared/lib/env';
import type { ApiSuccessResponse } from '@/shared/types/api';

async function getMatches(): Promise<Match[]> {
  const response = await fetch(`${env.NEXTAUTH_URL}/api/matches`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch matches');
  }

  const payload = (await response.json()) as ApiSuccessResponse<Match[]>;

  return payload.data;
}

export default async function HomePage() {
  const matches = await getMatches();

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-brand text-sm font-medium tracking-wide uppercase">
            Match Timeline
          </p>
          <h1 className="text-foreground text-3xl font-bold">
            Partidos del día
          </h1>
          <p className="text-muted-foreground text-sm">
            Explora los eventos más próximos y revisa las cuotas del mercado
            1X2.
          </p>
        </div>

        <MatchesList matches={matches} />
      </section>
    </AppShell>
  );
}
