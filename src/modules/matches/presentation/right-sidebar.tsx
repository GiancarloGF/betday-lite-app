'use client';

import type { Match } from '@/modules/matches/domain/match';
import { PendingBetsPanel } from '@/modules/bets/presentation/pending-bets-panel';

type RightSidebarProps = {
  matches: Match[];
};

/**
 * Right sidebar container for betting-related widgets.
 */
export function RightSidebar({ matches }: RightSidebarProps) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-24">
      <PendingBetsPanel matches={matches} />
    </aside>
  );
}
