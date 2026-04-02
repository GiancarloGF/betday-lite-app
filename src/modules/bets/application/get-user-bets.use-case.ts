import { SeedBetsRepository } from '../infrastructure/seed-bets.repository';
import { LocalStorageBetsRepository } from '../infrastructure/local-storage-bets.repository';
import { Bet } from '../domain/bet';

/**
 * Retrieves all user bets by combining:
 * - Seed bets (initial json dataset)
 * - User-created bets (localStorage)
 *
 * Returns bets sorted by most recent first
 */
export async function getUserBets(): Promise<Bet[]> {
  const seedRepo = new SeedBetsRepository();
  const localRepo = new LocalStorageBetsRepository();

  const seedBets = await seedRepo.getAll();
  const userBets = localRepo.getAll();

  return [...seedBets, ...userBets].sort(
    (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
  );
}
