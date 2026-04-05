'use server';

import type { Match } from '@/modules/matches/domain/match';
import { getTodayMatchesUseCase } from '@/modules/matches/application/get-today-matches.use-case';

/**
 * Next.js server action adapter for reading the home matches list.
 */
export async function getTodayMatchesAction(): Promise<Match[]> {
  return getTodayMatchesUseCase();
}
