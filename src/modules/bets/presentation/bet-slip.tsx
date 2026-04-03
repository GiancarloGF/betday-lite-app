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
        <p className="text-muted-foreground text-xs uppercase">Bet slip</p>

        <h3 className="text-sm font-semibold">
          {match?.homeTeam.name ?? 'Equipo'} vs{' '}
          {match?.awayTeam.name ?? 'Equipo'}
        </h3>

        <p className="text-muted-foreground text-xs">
          {format(parseISO(lastBet.placedAt), 'dd/MM HH:mm')}
        </p>
      </div>

      <div className="bg-card relative overflow-hidden rounded-[1.35rem]">
        <div className="bg-brand absolute inset-y-0 left-0 w-2 rounded-r-full" />

        <div className="bg-muted/45 ml-4 space-y-4 rounded-[1.2rem] px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-foreground truncate text-xl font-bold uppercase">
                {match?.homeTeam.name ?? 'Equipo'}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm font-semibold">
                Resultado del partido (1X2)
              </p>
            </div>

            <Badge variant="secondary">Pendiente</Badge>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-foreground text-lg leading-tight font-semibold">
                {match?.homeTeam.name ?? 'Equipo'} vs{' '}
                {match?.awayTeam.name ?? 'Equipo'}
              </p>
            </div>

            <p className="text-foreground shrink-0 text-5xl leading-none font-bold">
              {lastBet.odd.toFixed(2)}
            </p>
          </div>

          <div className="bg-card/75 grid grid-cols-3 gap-3 rounded-[1rem] p-3 text-sm">
            <div>
              <p className="text-muted-foreground text-[11px] font-medium uppercase">
                Seleccion
              </p>
              <p className="text-foreground mt-1 font-semibold">
                {lastBet.pick === 'HOME'
                  ? '1'
                  : lastBet.pick === 'DRAW'
                    ? 'X'
                    : '2'}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground text-[11px] font-medium uppercase">
                Cuota
              </p>
              <p className="text-foreground mt-1 font-semibold">
                {lastBet.odd.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground text-[11px] font-medium uppercase">
                Stake
              </p>
              <p className="text-foreground mt-1 font-semibold">
                S/ {lastBet.stake.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Retorno</span>
            <span className="text-foreground font-semibold">
              S/ {estimatedReturn.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
