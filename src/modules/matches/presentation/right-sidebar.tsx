import type { PendingBetSummary } from '@/modules/bets/domain/pending-bet-summary';
import { PendingBetsPanel } from '@/modules/bets/presentation/pending-bets-panel';

type RightSidebarProps = {
  pendingBets: PendingBetSummary[];
};

/**
 * Right sidebar container for betting-related widgets.
 */
export function RightSidebar({ pendingBets }: RightSidebarProps) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-24">
      <PendingBetsPanel pendingBets={pendingBets} />
    </aside>
  );
}
