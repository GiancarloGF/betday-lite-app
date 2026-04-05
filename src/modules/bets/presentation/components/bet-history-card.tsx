import Link from 'next/link';
import { format, parseISO } from 'date-fns';

import type { Bet, BetPick, BetStatus } from '@/modules/bets/domain/bet';
import type { Match } from '@/modules/matches/domain/match';
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
  const statusLabel =
    bet.status === 'PENDING'
      ? 'Pendiente'
      : bet.status === 'WON'
        ? 'Ganada'
        : 'Perdida';

  return (
    <Link
      href={`/bets/${bet.id}`}
      aria-label={`Ver detalle de la apuesta para ${homeTeam} vs ${awayTeam}`}
      className="group block focus-visible:outline-none"
    >
      <article className="border-border bg-card group-hover:bg-accent/20 group-focus-visible:border-brand/20 group-focus-visible:bg-accent/20 rounded-[1.7rem] border border-white/70 p-5 shadow-[0_24px_45px_-32px_rgba(15,23,42,0.28)] transition-colors duration-150">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-brand text-[11px] font-semibold tracking-[0.2em] uppercase">
              {match?.league.name ?? 'Liga'}
            </p>
            <h3 className="text-foreground mt-1 line-clamp-2 text-lg font-semibold">
              {homeTeam} vs {awayTeam}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">{placedAt}</p>
          </div>

          <Badge variant={STATUS_VARIANTS[bet.status]}>{statusLabel}</Badge>
        </div>

        <div className="bg-muted/55 mt-4 grid grid-cols-3 gap-3 rounded-[1.1rem] p-3">
          <div>
            <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
              Pick
            </p>
            <p className="text-foreground mt-1 text-sm font-semibold">
              {PICK_LABELS[bet.pick]}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
              Cuota
            </p>
            <p className="text-foreground mt-1 text-sm font-semibold">
              {bet.odd.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
              Stake
            </p>
            <p className="text-foreground mt-1 text-sm font-semibold">
              S/ {bet.stake.toFixed(2)}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
