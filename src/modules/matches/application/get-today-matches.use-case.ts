import type { Match } from '../domain/match';
import { SupabaseMatchesRepository } from '../infrastructure/supabase-matches.repository';

/**
 * Returns today's matches sorted by start time (ascending),
 * so the closest matches appear first in the timeline
 */
export async function getTodayMatchesUseCase(): Promise<Match[]> {
  const repository = new SupabaseMatchesRepository();
  const matches = await repository.getAll();

  return matches.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );
}
