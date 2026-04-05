import { format, parseISO } from 'date-fns';

import type { Bet, BetPick, BetStatus } from '@/modules/bets/domain/bet';
import type { Match } from '@/modules/matches/domain/match';
import { BetNotFound } from '@/modules/bets/presentation/components/bet-not-found';
import { Badge } from '@/shared/components/ui/badge';

type BetDetailSectionProps = {
  bet: Bet | null;
  match?: Match;
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
export function BetDetailSection({ bet, match }: BetDetailSectionProps) {
  if (!bet) {
    return <BetNotFound />;
  }

  const placedAt = format(parseISO(bet.placedAt), 'dd/MM/yyyy HH:mm');

  return (
    <section className="space-y-6">
      <div className="rounded-[1.9rem] bg-[linear-gradient(135deg,color-mix(in_oklch,var(--brand)_96%,white),color-mix(in_oklch,var(--brand)_82%,black))] px-6 py-7 text-white shadow-[0_26px_50px_-28px_color-mix(in_oklch,var(--brand)_42%,black)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.24em] text-white/80 uppercase">
              {match?.league.name ?? 'Liga'}
            </p>
            <h1 className="mt-2 text-3xl leading-tight font-semibold tracking-tight">
              {match?.homeTeam.name ?? 'Equipo local'} vs{' '}
              {match?.awayTeam.name ?? 'Equipo visitante'}
            </h1>
            <p className="mt-3 text-sm text-white/80">
              Fecha de apuesta: {placedAt}
            </p>
          </div>

          <Badge
            variant={STATUS_VARIANTS[bet.status]}
            className="border-white/20 bg-white/12 text-white"
          >
            {bet.status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-border bg-card rounded-[1.5rem] border border-white/70 p-5 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)]">
          <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
            Selección
          </p>
          <p className="text-foreground mt-2 text-2xl font-semibold">
            {PICK_LABELS[bet.pick]}
          </p>
        </div>

        <div className="border-border bg-card rounded-[1.5rem] border border-white/70 p-5 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)]">
          <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
            Cuota
          </p>
          <p className="text-foreground mt-2 text-2xl font-semibold">
            {bet.odd.toFixed(2)}
          </p>
        </div>

        <div className="border-border bg-card rounded-[1.5rem] border border-white/70 p-5 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)]">
          <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
            Stake
          </p>
          <p className="text-foreground mt-2 text-2xl font-semibold">
            S/ {bet.stake.toFixed(2)}
          </p>
        </div>

        <div className="border-border bg-card rounded-[1.5rem] border border-white/70 p-5 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)]">
          <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
            Retorno
          </p>
          <p className="text-foreground mt-2 text-2xl font-semibold">
            {bet.return !== null ? `S/ ${bet.return.toFixed(2)}` : 'Pendiente'}
          </p>
        </div>
      </div>
    </section>
  );
}
