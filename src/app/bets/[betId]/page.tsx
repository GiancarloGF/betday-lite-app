import { getServerSession } from 'next-auth';

import { authOptions } from '@/modules/auth/infrastructure/auth.config';
import { BetDetailContent } from '@/modules/bets/presentation/components/bet-detail-content';
import { BetDetailSkeleton } from '@/modules/bets/presentation/components/skeletons/bet-detail-skeleton';
import { AppShell } from '@/shared/components/layout/app-shell';
import { createPageMetadata } from '@/shared/lib/seo';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

type PageProps = {
  params: Promise<{ betId: string }>;
};

export const metadata: Metadata = createPageMetadata({
  title: 'Detalle de apuesta',
  description: 'Detalle privado de una apuesta realizada por el usuario.',
  path: '/bets',
  index: false,
});

/**
 * Renders the bet detail page.
 */
export default async function BetDetailPage({ params }: PageProps) {
  const { betId } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login?callbackUrl=/bets/${betId}`);
  }

  return (
    <AppShell>
      <div className="space-y-7">
        <div className="space-y-3">
          <p className="text-brand text-sm font-semibold tracking-[0.24em] uppercase">
            Bet Detail
          </p>
          <h1 className="text-foreground text-4xl leading-tight font-semibold tracking-tight">
            Detalle de apuesta
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base">
            Consulta la información completa de tu apuesta y revisa su estado
            actual.
          </p>
        </div>

        <Suspense fallback={<BetDetailSkeleton />}>
          <BetDetailContent betId={betId} />
        </Suspense>
      </div>
    </AppShell>
  );
}
