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
const envFilePath = path.join(projectRoot, '.env.local');

function loadLocalEnvFile() {
  return readFile(envFilePath, 'utf-8')
    .then((fileContent) => {
      const lines = fileContent.split(/\r?\n/);

      for (const line of lines) {
        const trimmedLine = line.trim();

        if (trimmedLine.length === 0 || trimmedLine.startsWith('#')) {
          continue;
        }

        const separatorIndex = trimmedLine.indexOf('=');

        if (separatorIndex === -1) {
          continue;
        }

        const key = trimmedLine.slice(0, separatorIndex).trim();
        const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
        const normalizedValue = rawValue.replace(/^['"]|['"]$/g, '');

        if (!process.env[key]) {
          process.env[key] = normalizedValue;
        }
      }
    })
    .catch((error) => {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        return;
      }

      throw error;
    });
}

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
  await loadLocalEnvFile();

  const supabaseUrl = readRequiredEnv('SUPABASE_URL');
  const supabaseSecretKey = readRequiredEnv('SUPABASE_SECRET_KEY');

  const supabase = createClient(supabaseUrl, supabaseSecretKey, {
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
