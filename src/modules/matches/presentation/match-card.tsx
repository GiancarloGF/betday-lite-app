import { format, parseISO } from 'date-fns';

import type { Match } from '../domain/match';

/**
 * MatchCard renders the main betting information for a single match.
 */
export function MatchCard({ match }: { match: Match }) {
  const startTime = format(parseISO(match.startTime), 'HH:mm');

  return (
    <article className="border-border bg-card rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-brand text-xs font-medium tracking-wide uppercase">
            {match.league.name}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {match.league.country}
          </p>
        </div>

        <div className="bg-surface-muted text-foreground rounded-xl px-3 py-1 text-sm font-semibold">
          {startTime}
        </div>
      </div>

      <div className="mb-5 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-foreground text-base font-semibold">
              {match.homeTeam.name}
            </p>
            <p className="text-muted-foreground text-sm">
              {match.homeTeam.shortName}
            </p>
          </div>

          <span className="text-muted-foreground text-sm font-medium">vs</span>

          <div className="text-right">
            <p className="text-foreground text-base font-semibold">
              {match.awayTeam.name}
            </p>
            <p className="text-muted-foreground text-sm">
              {match.awayTeam.shortName}
            </p>
          </div>
        </div>
      </div>

      {/* Betting actions will become interactive in the next step. */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          className="border-border bg-surface hover:border-brand hover:bg-surface-muted rounded-xl border px-3 py-3 text-left transition-colors"
        >
          <span className="text-muted-foreground block text-xs font-medium tracking-wide uppercase">
            1
          </span>
          <span className="text-foreground mt-1 block text-lg font-bold">
            {match.market.odds.home.toFixed(2)}
          </span>
        </button>

        <button
          type="button"
          className="border-border bg-surface hover:border-brand hover:bg-surface-muted rounded-xl border px-3 py-3 text-left transition-colors"
        >
          <span className="text-muted-foreground block text-xs font-medium tracking-wide uppercase">
            X
          </span>
          <span className="text-foreground mt-1 block text-lg font-bold">
            {match.market.odds.draw.toFixed(2)}
          </span>
        </button>

        <button
          type="button"
          className="border-border bg-surface hover:border-brand hover:bg-surface-muted rounded-xl border px-3 py-3 text-left transition-colors"
        >
          <span className="text-muted-foreground block text-xs font-medium tracking-wide uppercase">
            2
          </span>
          <span className="text-foreground mt-1 block text-lg font-bold">
            {match.market.odds.away.toFixed(2)}
          </span>
        </button>
      </div>
    </article>
  );
}
