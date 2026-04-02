import { NextResponse } from 'next/server';

import { SeedBetsRepository } from '@/modules/bets/infrastructure/seed-bets.repository';

/**
 * Returns only the seed bets dataset for phase 1.
 * User-created bets are persisted in localStorage on the client side
 * and will be merged later in the application layer.
 */
export async function GET() {
  try {
    const seedBetsRepository = new SeedBetsRepository();

    const bets = await seedBetsRepository.getAll();

    return NextResponse.json({
      data: bets,
    });
  } catch (error) {
    console.error('Failed to load seed bets:', error);

    return NextResponse.json(
      {
        message: 'Failed to load bets',
      },
      { status: 500 },
    );
  }
}
