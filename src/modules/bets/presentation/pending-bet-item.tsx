import { format, parseISO } from 'date-fns';

import type { Bet, BetPick } from '@/modules/bets/domain/bet';
import type { Match } from '@/modules/matches/domain/match';
import { Badge } from '@/shared/components/ui/badge';

type PendingBetItemProps = {
  bet: Bet;
  match?: Match;
};

const PICK_LABELS: Record<BetPick, string> = {
  HOME: '1',
  DRAW: 'X',
  AWAY: '2',
};

/**
 * Displays a compact pending bet summary.
 */
export function PendingBetItem({ bet, match }: PendingBetItemProps) {
  return (
    <article className="border-border bg-card rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-foreground truncate text-sm font-semibold">
            {match?.homeTeam.name ?? 'Equipo local'} vs{' '}
            {match?.awayTeam.name ?? 'Equipo visitante'}
          </p>

          <p className="text-muted-foreground mt-1 text-xs">
            {format(parseISO(bet.placedAt), 'dd/MM HH:mm')}
          </p>
        </div>

        <Badge variant="secondary">PENDING</Badge>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            Pick
          </p>
          <p className="text-foreground mt-1 font-semibold">
            {PICK_LABELS[bet.pick]}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            Odd
          </p>
          <p className="text-foreground mt-1 font-semibold">
            {bet.odd.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            Stake
          </p>
          <p className="text-foreground mt-1 font-semibold">
            S/ {bet.stake.toFixed(2)}
          </p>
        </div>
      </div>
    </article>
  );
}
