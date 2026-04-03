import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

import type { Match } from '../domain/match';

export type MatchDateGroup = {
  dateKey: string;
  label: string;
  matches: Match[];
};

/**
 * Returns the local calendar day for a match using its ISO start time.
 */
export function getMatchDateKey(match: Match): string {
  return format(parseISO(match.startTime), 'yyyy-MM-dd');
}

/**
 * Returns the available unique match dates ordered chronologically.
 */
export function getMatchDateKeys(matches: Match[]): string[] {
  return [...new Set(matches.map((match) => getMatchDateKey(match)))].sort();
}

/**
 * Formats a date key into a human-readable Spanish label.
 */
export function formatMatchDateLabel(dateKey: string): string {
  return format(parseISO(dateKey), "EEEE d 'de' MMMM", {
    locale: es,
  });
}

/**
 * Groups matches by local calendar day preserving the input order.
 */
export function groupMatchesByDate(matches: Match[]): MatchDateGroup[] {
  const groupedMatches = new Map<string, Match[]>();

  matches.forEach((match) => {
    const dateKey = getMatchDateKey(match);
    const currentMatches = groupedMatches.get(dateKey);

    if (currentMatches) {
      currentMatches.push(match);
      return;
    }

    groupedMatches.set(dateKey, [match]);
  });

  return Array.from(groupedMatches.entries()).map(([dateKey, grouped]) => ({
    dateKey,
    label: formatMatchDateLabel(dateKey),
    matches: grouped,
  }));
}
