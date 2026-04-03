import matchesData from '@/shared/data/matches.today.50.json';
import { Match } from '../domain/match';

export class JsonMatchesRepository {
  async getTodayMatches(): Promise<Match[]> {
    return matchesData.matches as Match[];
  }
}
