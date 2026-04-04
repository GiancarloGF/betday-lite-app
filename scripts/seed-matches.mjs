import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const matchesFilePath = path.join(
  projectRoot,
  'src',
  'shared',
  'data',
  'matches.today.50.json',
);

function readRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function readMatchesSeed() {
  const fileContent = await readFile(matchesFilePath, 'utf-8');
  const payload = JSON.parse(fileContent);

  if (!Array.isArray(payload.matches)) {
    throw new Error('Invalid matches seed payload');
  }

  return payload.matches.map((match) => ({
    id: match.id,
    start_time: match.startTime,
    league_id: match.league.id,
    league_name: match.league.name,
    league_country: match.league.country,
    home_team_id: match.homeTeam.id,
    home_team_name: match.homeTeam.name,
    home_team_short_name: match.homeTeam.shortName,
    away_team_id: match.awayTeam.id,
    away_team_name: match.awayTeam.name,
    away_team_short_name: match.awayTeam.shortName,
    market_type: match.market.type,
    odd_home: match.market.odds.home,
    odd_draw: match.market.odds.draw,
    odd_away: match.market.odds.away,
  }));
}

async function seedMatches() {
  const supabaseUrl = readRequiredEnv('SUPABASE_URL');
  const supabaseServiceRoleKey = readRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const matches = await readMatchesSeed();

  const { error } = await supabase.from('matches').upsert(matches, {
    onConflict: 'id',
  });

  if (error) {
    throw new Error(`Failed to seed matches: ${error.message}`);
  }

  console.log(`Seeded ${matches.length} matches into public.matches`);
}

seedMatches().catch((error) => {
  const message = error instanceof Error ? error.message : 'Unknown seed error';
  console.error(message);
  process.exit(1);
});
