import { authOptions } from '@/modules/auth/infrastructure/auth.config';
import { ProfileBetsHistoryContent } from '@/modules/bets/presentation/components/profile-bets-history-content';
import { ProfileBetsHistorySkeleton } from '@/modules/bets/presentation/components/skeletons/profile-bets-history-skeleton';
import { AppShell } from '@/shared/components/layout/app-shell';
import { createPageMetadata } from '@/shared/lib/seo';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = createPageMetadata({
  title: 'Mis apuestas',
  description: 'Consulta tu historial y el estado de tus apuestas.',
  path: '/profile',
  index: false,
});

/**
 * Renders the private profile page with the user's bet history.
 */
export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/profile');
  }

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

        <Suspense fallback={<ProfileBetsHistorySkeleton />}>
          <ProfileBetsHistoryContent />
        </Suspense>
      </div>
    </AppShell>
  );
}
