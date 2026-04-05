import { describe, expect, it, vi } from 'vitest';

import { getTodayMatchesUseCase } from '@/modules/matches/application/get-today-matches.use-case';
import type { Match } from '@/modules/matches/domain/match';
import { SupabaseMatchesRepository } from '@/modules/matches/infrastructure/supabase-matches.repository';

vi.mock('@/modules/matches/infrastructure/supabase-matches.repository');

function createMatch(id: string, startTime: string): Match {
  return {
    id,
    startTime,
    league: {
      id: 'league_1',
      name: 'League',
      country: 'Country',
    },
    homeTeam: {
      id: `${id}_home`,
      name: 'Home',
      shortName: 'HOM',
    },
    awayTeam: {
      id: `${id}_away`,
      name: 'Away',
      shortName: 'AWY',
    },
    market: {
      type: '1X2',
      odds: {
        home: 1.5,
        draw: 2.5,
        away: 3.5,
      },
    },
  };
}

/**
 * Verifies that the home timeline source is sorted by nearest match first,
 * which is a core requirement of the challenge.
 */
describe('getTodayMatches', () => {
  it('should return matches sorted by start time in ascending order', async () => {
    vi.mocked(SupabaseMatchesRepository.prototype.getAll).mockResolvedValueOnce(
      [
        createMatch('match_2', '2026-02-12T02:00:00.000Z'),
        createMatch('match_1', '2026-02-12T01:00:00.000Z'),
        createMatch('match_3', '2026-02-12T03:00:00.000Z'),
      ],
    );

    const matches = await getTodayMatchesUseCase();

    expect(matches.length).toBeGreaterThan(0);

    for (let index = 1; index < matches.length; index++) {
      const previous = new Date(matches[index - 1].startTime).getTime();
      const current = new Date(matches[index].startTime).getTime();

      expect(previous).toBeLessThanOrEqual(current);
    }
  });
});
