import { getPendingBetsAction } from '@/modules/bets/presentation/actions/get-pending-bet-summaries.action';
import { RightSidebar } from '@/modules/matches/presentation/components/right-sidebar';

/**
 * Server component for the home pending bets sidebar.
 */
export async function HomePendingBetsSidebarContent() {
  const pendingBets = await getPendingBetsAction();

  return <RightSidebar pendingBets={pendingBets} />;
}
