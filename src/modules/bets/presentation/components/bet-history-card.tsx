import Link from 'next/link';
import { format, parseISO } from 'date-fns';

import type { Bet, BetPick, BetStatus } from '@/modules/bets/domain/bet';
import type { Match } from '@/modules/matches/domain/match';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

type BetHistoryCardProps = {
  bet: Bet;
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
 * Displays a single bet with enriched match information.
 */
export function BetHistoryCard({ bet, match }: BetHistoryCardProps) {
  const homeTeam = match?.homeTeam.name ?? 'Equipo local';
  const awayTeam = match?.awayTeam.name ?? 'Equipo visitante';
  const placedAt = format(parseISO(bet.placedAt), 'dd/MM/yyyy HH:mm');

  return (
    <article className="border-border bg-card rounded-[1.7rem] border border-white/70 p-5 shadow-[0_24px_45px_-32px_rgba(15,23,42,0.28)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-brand text-[11px] font-semibold tracking-[0.2em] uppercase">
              {match?.league.name ?? 'Liga'}
            </p>
            <h3 className="text-foreground mt-1 text-xl font-semibold">
              {homeTeam} vs {awayTeam}
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="bg-muted/55 rounded-[1.1rem] p-3">
              <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                Selección
              </p>
              <p className="text-foreground mt-1 text-sm font-semibold">
                {PICK_LABELS[bet.pick]}
              </p>
            </div>

            <div className="bg-muted/55 rounded-[1.1rem] p-3">
              <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                Cuota
              </p>
              <p className="text-foreground mt-1 text-sm font-semibold">
                {bet.odd.toFixed(2)}
              </p>
            </div>

            <div className="bg-muted/55 rounded-[1.1rem] p-3">
              <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                Stake
              </p>
              <p className="text-foreground mt-1 text-sm font-semibold">
                S/ {bet.stake.toFixed(2)}
              </p>
            </div>

            <div className="bg-muted/55 rounded-[1.1rem] p-3">
              <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                Fecha
              </p>
              <p className="text-foreground mt-1 text-sm font-semibold">
                {placedAt}
              </p>
            </div>
          </div>

          {bet.return !== null ? (
            <div className="bg-muted/55 rounded-[1.1rem] p-3">
              <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                Retorno
              </p>
              <p className="text-foreground mt-1 text-sm font-semibold">
                S/ {bet.return.toFixed(2)}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <Badge variant={STATUS_VARIANTS[bet.status]}>{bet.status}</Badge>

          <Button asChild variant="outline" className="min-w-32">
            <Link href={`/bets/${bet.id}`}>Ver detalle</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
