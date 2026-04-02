import betsData from '@/data/bets.me.50.json';
import { Bet } from '../domain/bet';

const DEMO_USER_ID = 'demo-user';

export class SeedBetsRepository {
  async getAll(): Promise<Bet[]> {
    return betsData.bets.map((bet) => ({
      ...bet,
      source: 'seed',
      userId: DEMO_USER_ID,
    })) as Bet[];
  }
}
