'use client';

import { useMemo } from 'react';

import type { Match } from '@/modules/matches/domain/match';
import { useUserBetsStore } from '@/shared/stores/user-bets.store';
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
      <Card className="p-4">
        <p className="text-foreground text-sm font-semibold">
          Apuestas pendientes
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          No tienes apuestas pendientes por ahora.
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-4 p-4">
      <div>
        <p className="text-foreground text-sm font-semibold">
          Apuestas pendientes
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          {pendingBets.length} activas
        </p>
      </div>

      <div className="space-y-3">
        {pendingBets.map((bet) => {
          const match = matches.find((item) => item.id === bet.matchId);

          return <PendingBetItem key={bet.id} bet={bet} match={match} />;
        })}
      </div>
    </Card>
  );
}
