import { JsonMatchesRepository } from '../infrastructure/json-matches.repository';

/**
 * Returns today's matches sorted by start time (ascending),
 * so the closest matches appear first in the timeline
 */
export async function getTodayMatches() {
  const repo = new JsonMatchesRepository();

  const matches = await repo.getTodayMatches();

  return matches.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );
}
