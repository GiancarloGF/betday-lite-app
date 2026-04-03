import { HomeMatchesContent } from '@/modules/matches/presentation/home-matches-content';
import { MatchesListSkeleton } from '@/modules/matches/presentation/matches-list-skeleton';
import { AppShell } from '@/shared/components/layout/app-shell';
import { createPageMetadata } from '@/shared/lib/seo';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = createPageMetadata({
  title: 'Partidos del dia',
  description:
    'Explora los partidos disponibles y revisa las cuotas 1X2 de esta demo de apuestas deportivas.',
  path: '/',
  index: true,
});

export default async function HomePage() {
  return (
    <AppShell>
      <div className="space-y-7 xl:flex xl:h-[calc(100vh-9.5rem)] xl:flex-col xl:space-y-6 xl:overflow-hidden">
        <div className="space-y-3">
          <p className="text-brand text-sm font-semibold tracking-[0.24em] uppercase">
            Match Timeline
          </p>
          <h1 className="text-foreground text-4xl leading-tight font-semibold tracking-tight">
            Partidos del día
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base">
            Explora los eventos más próximos y revisa las cuotas del mercado
            1X2.
          </p>
        </div>

        <div className="min-h-0 flex-1">
          <Suspense fallback={<MatchesListSkeleton />}>
            <HomeMatchesContent />
          </Suspense>
        </div>
      </div>
    </AppShell>
  );
}
