import type { Match } from '@/modules/matches/domain/match';
import { getSupabaseServerClient } from '@/shared/lib/supabase/server';

type MatchRow = {
  id: string;
  start_time: string;
  league_id: string;
  league_name: string;
  league_country: string;
  home_team_id: string;
  home_team_name: string;
  home_team_short_name: string;
  away_team_id: string;
  away_team_name: string;
  away_team_short_name: string;
  market_type: '1X2';
  odd_home: number;
  odd_draw: number;
  odd_away: number;
};

function mapMatchRowToDomain(row: MatchRow): Match {
  return {
    id: row.id,
    startTime: row.start_time,
    league: {
      id: row.league_id,
      name: row.league_name,
      country: row.league_country,
    },
    homeTeam: {
      id: row.home_team_id,
      name: row.home_team_name,
      shortName: row.home_team_short_name,
    },
    awayTeam: {
      id: row.away_team_id,
      name: row.away_team_name,
      shortName: row.away_team_short_name,
    },
    market: {
      type: row.market_type,
      odds: {
        home: Number(row.odd_home),
        draw: Number(row.odd_draw),
        away: Number(row.odd_away),
      },
    },
  };
}

/**
 * Reads match data from Supabase and maps it back to the current domain shape.
 */
export class SupabaseMatchesRepository {
  async getAll(): Promise<Match[]> {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('matches')
      .select(
        'id, start_time, league_id, league_name, league_country, home_team_id, home_team_name, home_team_short_name, away_team_id, away_team_name, away_team_short_name, market_type, odd_home, odd_draw, odd_away',
      )
      .order('start_time', { ascending: true });

    if (error) {
      throw new Error(`Failed to read matches from Supabase: ${error.message}`);
    }

    return (data ?? []).map((row) => mapMatchRowToDomain(row as MatchRow));
  }

  async getById(matchId: string): Promise<Match | null> {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('matches')
      .select(
        'id, start_time, league_id, league_name, league_country, home_team_id, home_team_name, home_team_short_name, away_team_id, away_team_name, away_team_short_name, market_type, odd_home, odd_draw, odd_away',
      )
      .eq('id', matchId)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to read match ${matchId} from Supabase: ${error.message}`,
      );
    }

    if (!data) {
      return null;
    }

    return mapMatchRowToDomain(data as MatchRow);
  }
}
