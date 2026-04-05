import Link from 'next/link';

import type { PendingBetSummary } from '@/modules/bets/domain/pending-bet-summary';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { PendingBetItem } from '@/modules/bets/presentation/components/pending-bet-item';

/**
 * Displays the list of pending user bets.
 */
export function PendingBetsPanel({
  pendingBets,
}: {
  pendingBets: PendingBetSummary[];
}) {
  if (pendingBets.length === 0) {
    return (
      <Card className="rounded-[1.7rem] p-5">
        <p className="text-foreground text-sm font-semibold tracking-[0.2em] uppercase">
          Ultimas apuestas
        </p>
        <p className="text-muted-foreground border-brand/15 bg-muted/35 mt-6 rounded-[1.4rem] border border-dashed px-4 py-10 text-center text-sm">
          No tienes apuestas pendientes por ahora.
        </p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-5 rounded-[1.7rem] p-5">
      <div>
        <p className="text-foreground text-sm font-semibold tracking-[0.2em] uppercase">
          Ultimas apuestas ({pendingBets.length})
        </p>
      </div>

      <div className="space-y-3">
        {pendingBets.map((summary) => (
          <PendingBetItem key={summary.id} summary={summary} />
        ))}
      </div>

      <Button asChild variant="outline" className="w-full">
        <Link href="/profile">Ver todas mis apuestas</Link>
      </Button>
    </Card>
  );
}
