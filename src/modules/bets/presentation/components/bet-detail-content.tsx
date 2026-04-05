import { getBetDetailAction } from '@/modules/bets/presentation/actions/get-bet-detail.action';
import { BetDetailSection } from '@/modules/bets/presentation/components/bet-detail-section';

type BetDetailContentProps = {
  betId: string;
};

/**
 * Server component for the private bet detail section.
 */
export async function BetDetailContent({ betId }: BetDetailContentProps) {
  const { bet, match } = await getBetDetailAction(betId);

  return <BetDetailSection bet={bet} match={match ?? undefined} />;
}
