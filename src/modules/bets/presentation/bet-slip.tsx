'use client';

import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';

import { useUserBetsStore } from '@/shared/stores/user-bets.store';
import type { Match } from '@/modules/matches/domain/match';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

type BetSlipProps = {
  matches: Match[];
};

/**
 * Displays a simple bet slip based on the latest user bet.
 */
export function BetSlip({ matches }: BetSlipProps) {
  const userBets = useUserBetsStore((s) => s.userBets);

  const lastBet = useMemo(() => {
    if (userBets.length === 0) return null;

    return [...userBets].sort(
      (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
    )[0];
  }, [userBets]);

  const match = useMemo(() => {
    if (!lastBet) return undefined;
    return matches.find((m) => m.id === lastBet.matchId);
  }, [lastBet, matches]);

  if (!lastBet) {
    return (
      <Card className="text-muted-foreground p-4 text-sm">
        No hay apuestas recientes
      </Card>
    );
  }

  const estimatedReturn = lastBet.stake * lastBet.odd;

  return (
    <Card className="space-y-4 p-4">
      <div>
        <p className="text-muted-foreground text-xs uppercase">Bet Slip</p>

        <h3 className="text-sm font-semibold">
          {match?.homeTeam.name ?? 'Equipo'} vs{' '}
          {match?.awayTeam.name ?? 'Equipo'}
        </h3>

        <p className="text-muted-foreground text-xs">
          {format(parseISO(lastBet.placedAt), 'dd/MM HH:mm')}
        </p>
      </div>

      <div className="flex justify-between text-sm">
        <span>Stake</span>
        <span className="font-medium">S/ {lastBet.stake.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Cuota</span>
        <span className="font-medium">{lastBet.odd.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Retorno</span>
        <span className="font-semibold text-green-600">
          S/ {estimatedReturn.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-end">
        <Badge variant="secondary">Última apuesta</Badge>
      </div>
    </Card>
  );
}
