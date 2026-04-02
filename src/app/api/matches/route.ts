import { NextResponse } from 'next/server';

import { getTodayMatches } from '@/modules/matches/application/get-today-matches.use-case';

/**
 * Returns today's matches sorted by nearest start time first.
 * This route is used as the server-facing source for the public timeline.
 */
export async function GET() {
  try {
    const matches = await getTodayMatches();

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
