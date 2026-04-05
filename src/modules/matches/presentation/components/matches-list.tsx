import type { Match } from '../../domain/match';
import { groupMatchesByDate } from '../match-date.utils';
import { MatchCard } from './match-card';

/**
 * MatchesList renders the full home timeline using already-sorted matches.
 */
export function MatchesList({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return (
      <div className="border-border bg-card rounded-[1.6rem] border border-dashed p-10 text-center shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)]">
        <p className="text-foreground text-base font-medium">
          No hay partidos disponibles.
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          Intenta nuevamente más tarde.
        </p>
      </div>
    );
  }

  const groupedMatches = groupMatchesByDate(matches);

  return (
    <div className="space-y-5">
      {groupedMatches.map((group, groupIndex) => (
        <section key={group.dateKey} className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-foreground text-sm font-semibold tracking-tight">
              {group.label}
            </h2>
            <div className="bg-border h-px flex-1" />
          </div>

          <div className="motion-stagger-container grid gap-3">
            {group.matches.map((match, matchIndex) => (
              <MatchCard
                key={match.id}
                match={match}
                index={groupIndex * 12 + matchIndex}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
