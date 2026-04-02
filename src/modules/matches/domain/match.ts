export type MatchMarketType = '1X2';

export type Team = {
  id: string;
  name: string;
  shortName: string;
};

export type League = {
  id: string;
  name: string;
  country: string;
};

export type MatchOdds = {
  home: number;
  draw: number;
  away: number;
};

export type MatchMarket = {
  type: MatchMarketType;
  odds: MatchOdds;
};

export type Match = {
  id: string;
  startTime: string;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
  market: MatchMarket;
};
