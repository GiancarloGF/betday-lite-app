import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { Match } from '@/modules/matches/domain/match';
import {
  getMatchDateKey,
  getMatchDateKeys,
  groupMatchesByDate,
} from '@/modules/matches/presentation/match-date.utils';

function createMatch(id: string, startTime: string): Match {
  return {
    id,
    startTime,
    league: {
      id: 'league-1',
      name: 'Liga Demo',
      country: 'Colombia',
    },
    homeTeam: {
      id: `${id}-home`,
      name: `Home ${id}`,
      shortName: `H${id}`,
    },
    awayTeam: {
      id: `${id}-away`,
      name: `Away ${id}`,
      shortName: `A${id}`,
    },
    market: {
      type: '1X2',
      odds: {
        home: 1.5,
        draw: 3.2,
        away: 2.8,
      },
    },
  };
}

describe('match-date.utils', () => {
  const originalTimeZone = process.env.TZ;

  beforeAll(() => {
    process.env.TZ = 'America/Bogota';
  });

  afterAll(() => {
    process.env.TZ = originalTimeZone;
  });

  it('should return unique date keys sorted in chronological order', () => {
    const matches = [
      createMatch('match-2', '2026-02-14T09:00:00-05:00'),
      createMatch('match-1', '2026-02-12T19:00:00-05:00'),
      createMatch('match-3', '2026-02-12T21:00:00-05:00'),
      createMatch('match-4', '2026-02-13T08:30:00-05:00'),
    ];

    expect(getMatchDateKeys(matches)).toEqual([
      '2026-02-12',
      '2026-02-13',
      '2026-02-14',
    ]);
  });

  it('should group matches by date without changing the original order', () => {
    const matches = [
      createMatch('match-1', '2026-02-12T08:00:00-05:00'),
      createMatch('match-2', '2026-02-12T10:00:00-05:00'),
      createMatch('match-3', '2026-02-13T09:00:00-05:00'),
    ];

    expect(groupMatchesByDate(matches)).toEqual([
      {
        dateKey: '2026-02-12',
        label: 'jueves 12 de febrero',
        matches: [matches[0], matches[1]],
      },
      {
        dateKey: '2026-02-13',
        label: 'viernes 13 de febrero',
        matches: [matches[2]],
      },
    ]);
  });

  it('should derive the local calendar date from the ISO offset', () => {
    const match = createMatch('match-1', '2026-02-13T00:30:00+02:00');

    expect(getMatchDateKey(match)).toBe('2026-02-12');
  });
});
