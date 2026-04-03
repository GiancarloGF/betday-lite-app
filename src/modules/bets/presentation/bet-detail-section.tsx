'use client';

import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';

import type { Bet, BetPick, BetStatus } from '@/modules/bets/domain/bet';
import type { Match } from '@/modules/matches/domain/match';
import { useUserBetsStore } from '@/shared/stores/user-bets.store';
import { Badge } from '@/shared/components/ui/badge';

type BetDetailSectionProps = {
  betId: string;
  seedBets: Bet[];
  matches: Match[];
};

const PICK_LABELS: Record<BetPick, string> = {
  HOME: '1',
  DRAW: 'X',
  AWAY: '2',
};

const STATUS_VARIANTS: Record<
  BetStatus,
  'secondary' | 'default' | 'destructive'
> = {
  PENDING: 'secondary',
  WON: 'default',
  LOST: 'destructive',
};

/**
 * Displays detailed information for a selected bet.
 */
export function BetDetailSection({
  betId,
  seedBets,
  matches,
}: BetDetailSectionProps) {
  const userBets = useUserBetsStore((state) => state.userBets);

  const bet = useMemo(() => {
    return [...seedBets, ...userBets].find((b) => b.id === betId);
  }, [seedBets, userBets, betId]);

  const match = useMemo(() => {
    if (!bet) return undefined;
    return matches.find((m) => m.id === bet.matchId);
  }, [bet, matches]);

  if (!bet) {
    return null;
  }

  const placedAt = format(parseISO(bet.placedAt), 'dd/MM/yyyy HH:mm');

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-brand text-sm font-medium tracking-wide uppercase">
            {match?.league.name ?? 'Liga'}
          </p>
          <h1 className="text-foreground mt-1 text-2xl font-bold">
            {match?.homeTeam.name ?? 'Equipo local'} vs{' '}
            {match?.awayTeam.name ?? 'Equipo visitante'}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Fecha de apuesta: {placedAt}
          </p>
        </div>

        <Badge variant={STATUS_VARIANTS[bet.status]}>{bet.status}</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-border rounded-2xl border p-4">
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            Selección
          </p>
          <p className="text-foreground mt-1 text-lg font-semibold">
            {PICK_LABELS[bet.pick]}
          </p>
        </div>

        <div className="border-border rounded-2xl border p-4">
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            Cuota
          </p>
          <p className="text-foreground mt-1 text-lg font-semibold">
            {bet.odd.toFixed(2)}
          </p>
        </div>

        <div className="border-border rounded-2xl border p-4">
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            Stake
          </p>
          <p className="text-foreground mt-1 text-lg font-semibold">
            S/ {bet.stake.toFixed(2)}
          </p>
        </div>

        <div className="border-border rounded-2xl border p-4">
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            Retorno
          </p>
          <p className="text-foreground mt-1 text-lg font-semibold">
            {bet.return !== null ? `S/ ${bet.return.toFixed(2)}` : 'Pendiente'}
          </p>
        </div>
      </div>
    </section>
  );
}
