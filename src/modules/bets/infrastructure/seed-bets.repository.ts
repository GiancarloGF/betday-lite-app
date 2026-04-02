import betsData from '@/data/bets.me.50.json';
import { Bet } from '../domain/bet';

const DEMO_USER_ID = 'demo-user';

export class SeedBetsRepository {
  async getAll(): Promise<Bet[]> {
    // Map seed bets to domain model by injecting missing fields
    // (source and userId are not present in the original dataset)
    return betsData.bets.map((bet) => ({
      ...bet,
      source: 'seed',
      userId: DEMO_USER_ID,
    })) as Bet[];
  }
}
