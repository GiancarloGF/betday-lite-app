'use client';

import { useMemo } from 'react';
import Link from 'next/link';

import type { Match } from '@/modules/matches/domain/match';
import { useUserBetsStore } from '@/shared/stores/user-bets.store';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { PendingBetItem } from '@/modules/bets/presentation/pending-bet-item';

/**
 * Displays the list of pending user bets.
 */
export function PendingBetsPanel({ matches }: { matches: Match[] }) {
  const userBets = useUserBetsStore((state) => state.userBets);

  const pendingBets = useMemo(() => {
    return [...userBets]
      .filter((bet) => bet.status === 'PENDING')
      .sort(
        (a, b) =>
          new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
      );
  }, [userBets]);

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
    <Card className="space-y-5 rounded-[1.7rem] p-5">
      <div>
        <p className="text-foreground text-sm font-semibold tracking-[0.2em] uppercase">
          Ultimas apuestas ({pendingBets.length})
        </p>
      </div>

      <div className="space-y-3">
        {pendingBets.map((bet) => {
          const match = matches.find((item) => item.id === bet.matchId);

          return <PendingBetItem key={bet.id} bet={bet} match={match} />;
        })}
      </div>

      <Button asChild variant="outline" className="w-full">
        <Link href="/profile">Ver todas mis apuestas</Link>
      </Button>
    </Card>
  );
}
