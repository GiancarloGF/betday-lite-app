import { HomeMatchesContent } from '@/modules/matches/presentation/home-matches-content';
import { MatchesListSkeleton } from '@/modules/matches/presentation/matches-list-skeleton';
import { AppShell } from '@/shared/components/layout/app-shell';
import { Suspense } from 'react';

export default async function HomePage() {
  return (
    <AppShell>
      <div className="space-y-6">
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

        <Suspense fallback={<MatchesListSkeleton />}>
          <HomeMatchesContent />
        </Suspense>
      </div>
    </AppShell>
  );
}
