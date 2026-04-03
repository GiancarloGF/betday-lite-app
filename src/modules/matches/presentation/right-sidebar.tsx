'use client';

import type { Match } from '@/modules/matches/domain/match';
import { BetSlip } from '@/modules/bets/presentation/bet-slip';
import { PendingBetsPanel } from '@/modules/bets/presentation/pending-bets-panel';

type RightSidebarProps = {
  matches: Match[];
};

/**
 * Right sidebar container for betting-related widgets.
 */
export function RightSidebar({ matches }: RightSidebarProps) {
  return (
    <aside className="space-y-4">
      <PendingBetsPanel matches={matches} />
      {/*<BetSlip matches={matches} />*/}
    </aside>
  );
}
