import Link from 'next/link';
import { format, parseISO } from 'date-fns';

import type { BetPick } from '@/modules/bets/domain/bet';
import type { PendingBetSummary } from '@/modules/bets/domain/pending-bet-summary';
import { Badge } from '@/shared/components/ui/badge';

type PendingBetItemProps = {
  summary: PendingBetSummary;
};

const PICK_LABELS: Record<BetPick, string> = {
  HOME: '1',
  DRAW: 'X',
  AWAY: '2',
};

/**
 * Displays a compact pending bet summary.
 */
export function PendingBetItem({ summary }: PendingBetItemProps) {
  return (
    <Link
      href={`/bets/${summary.id}`}
      aria-label={`Ver detalle de la apuesta ${summary.homeTeamName} vs ${summary.awayTeamName}`}
      className="group block focus-visible:outline-none"
    >
      <article className="bg-surface group-hover:bg-accent/25 group-focus-visible:bg-accent/25 group-hover:border-brand/20 group-focus-visible:border-brand/20 relative overflow-hidden rounded-[1.35rem] border border-transparent transition-colors duration-150">
        <div className="bg-brand absolute inset-y-0 left-0 w-1.5 rounded-r-full" />

        <div className="bg-card/90 group-hover:bg-accent/20 group-focus-visible:bg-accent/20 ml-3 rounded-[1.2rem] border border-white/70 px-4 py-4 transition-colors duration-150">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-foreground truncate text-sm font-semibold">
                {summary.homeTeamName} vs {summary.awayTeamName}
              </p>

              <p className="text-muted-foreground mt-1 text-xs">
                {format(parseISO(summary.placedAt), 'dd/MM HH:mm')}
              </p>
            </div>

            <Badge variant="secondary">PENDIENTE</Badge>
          </div>

          <div className="bg-muted/50 mt-4 grid grid-cols-3 gap-3 rounded-[1rem] p-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                Pick
              </p>
              <p className="text-foreground mt-1 font-semibold">
                {PICK_LABELS[summary.pick]}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                Odd
              </p>
              <p className="text-foreground mt-1 font-semibold">
                {summary.odd.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                Stake
              </p>
              <p className="text-foreground mt-1 font-semibold">
                S/ {summary.stake.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
