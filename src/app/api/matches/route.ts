import { NextResponse } from 'next/server';

import { SupabaseMatchesRepository } from '@/modules/matches/infrastructure/supabase-matches.repository';

/**
 * Returns matches from the current server-authoritative source.
 */
export async function GET() {
  try {
    const matchesRepository = new SupabaseMatchesRepository();
    const matches = await matchesRepository.getAll();

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
