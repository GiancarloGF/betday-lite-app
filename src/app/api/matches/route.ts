import { NextResponse } from 'next/server';

import { getTodayMatchesUseCase } from '@/modules/matches/application/get-today-matches.use-case';

/**
 * Returns matches from the current server-authoritative source.
 */
export async function GET() {
  try {
    const matches = await getTodayMatchesUseCase();

    return NextResponse.json({
      data: matches,
    });
  } catch (error) {
    console.error('Failed to load matches:', error);

    return NextResponse.json(
      {
        message: 'Failed to load matches',
      },
      { status: 500 },
    );
  }
}
