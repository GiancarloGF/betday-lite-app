import type { Match } from '../domain/match';
import { MatchCard } from './match-card';

/**
 * MatchesList renders the full home timeline using already-sorted matches.
 */
export function MatchesList({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return (
      <div className="border-border bg-card rounded-2xl border border-dashed p-8 text-center">
        <p className="text-foreground text-base font-medium">
          No hay partidos disponibles.
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          Intenta nuevamente más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
