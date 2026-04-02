import { Bet } from '../domain/bet';

// Storage key for user-created bets in localStorage
const USER_BETS_STORAGE_KEY = 'betday:user-bets';

export class LocalStorageBetsRepository {
  getAll(): Bet[] {
    if (typeof window === 'undefined') return [];

    const data = localStorage.getItem(USER_BETS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  save(bets: Bet[]): void {
    localStorage.setItem(USER_BETS_STORAGE_KEY, JSON.stringify(bets));
  }

  create(bet: Bet): void {
    const bets = this.getAll();
    bets.push(bet);
    this.save(bets);
  }
}
