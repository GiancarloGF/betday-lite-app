import { describe, expect, it } from 'vitest';

import { getTodayMatches } from '@/modules/matches/application/get-today-matches.use-case';

/**
 * Verifies that the home timeline source is sorted by nearest match first,
 * which is a core requirement of the challenge.
 */
describe('getTodayMatches', () => {
  it('should return matches sorted by start time in ascending order', async () => {
    const matches = await getTodayMatches();

    expect(matches.length).toBeGreaterThan(0);

    for (let index = 1; index < matches.length; index++) {
      const previous = new Date(matches[index - 1].startTime).getTime();
      const current = new Date(matches[index].startTime).getTime();

      expect(previous).toBeLessThanOrEqual(current);
    }
  });
});
