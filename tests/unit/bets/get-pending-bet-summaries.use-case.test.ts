import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getPendingBetsUseCase } from '@/modules/bets/application/get-pending-bet-summaries.use-case';
import { SupabaseBetsRepository } from '@/modules/bets/infrastructure/supabase-bets.repository';
import { SupabaseMatchesRepository } from '@/modules/matches/infrastructure/supabase-matches.repository';

describe('getPendingBetsUseCase', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should request only pending bets from the repository and enrich them with match names', async () => {
    const pendingSpy = vi
      .spyOn(SupabaseBetsRepository.prototype, 'getPendingByUserId')
      .mockResolvedValue([
        {
          id: 'bet-1',
          userId: 'user-1',
          matchId: 'match-1',
          placedAt: '2026-02-12T01:00:00.000Z',
          pick: 'HOME',
          odd: 1.8,
          stake: 20,
          status: 'PENDING',
          return: null,
          source: 'user',
        },
      ]);

    const matchesSpy = vi
      .spyOn(SupabaseMatchesRepository.prototype, 'getByIds')
      .mockResolvedValue([
        {
          id: 'match-1',
          startTime: '2026-02-12T02:00:00.000Z',
          league: {
            id: 'league-1',
            name: 'Premier League',
            country: 'England',
          },
          homeTeam: {
            id: 'home-1',
            name: 'Arsenal',
            shortName: 'ARS',
          },
          awayTeam: {
            id: 'away-1',
            name: 'Chelsea',
            shortName: 'CHE',
          },
          market: {
            type: '1X2',
            odds: {
              home: 1.8,
              draw: 3.2,
              away: 4.1,
            },
          },
        },
      ]);

    const summaries = await getPendingBetsUseCase({
      userId: 'user-1',
    });

    expect(pendingSpy).toHaveBeenCalledWith('user-1');
    expect(matchesSpy).toHaveBeenCalledWith(['match-1']);
    expect(summaries).toEqual([
      {
        id: 'bet-1',
        placedAt: '2026-02-12T01:00:00.000Z',
        pick: 'HOME',
        odd: 1.8,
        stake: 20,
        matchId: 'match-1',
        homeTeamName: 'Arsenal',
        awayTeamName: 'Chelsea',
      },
    ]);
  });

  it('should return an empty array when the user has no pending bets', async () => {
    const pendingSpy = vi
      .spyOn(SupabaseBetsRepository.prototype, 'getPendingByUserId')
      .mockResolvedValue([]);
    const matchesSpy = vi.spyOn(
      SupabaseMatchesRepository.prototype,
      'getByIds',
    );

    const summaries = await getPendingBetsUseCase({
      userId: 'user-1',
    });

    expect(pendingSpy).toHaveBeenCalledWith('user-1');
    expect(matchesSpy).not.toHaveBeenCalled();
    expect(summaries).toEqual([]);
  });
});
