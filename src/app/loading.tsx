import { AppShell } from '@/shared/components/layout/app-shell';
import { MatchesListSkeleton } from '@/modules/matches/presentation/matches-list-skeleton';

/**
 * Renders the route-level loading state for the home page.
 */
export default function Loading() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="bg-surface-muted h-4 w-28 rounded" />
          <div className="bg-surface-muted h-9 w-56 rounded" />
          <div className="bg-surface-muted h-4 w-full max-w-xl rounded" />
        </div>

        <MatchesListSkeleton />
      </div>
    </AppShell>
  );
}
