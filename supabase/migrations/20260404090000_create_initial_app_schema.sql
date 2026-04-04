create extension if not exists pgcrypto;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_account_id text not null,
  email text not null,
  display_name text,
  avatar_url text,
  seeded_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint app_users_provider_account_unique unique (provider, provider_account_id),
  constraint app_users_email_unique unique (email)
);

create table if not exists public.wallets (
  user_id uuid primary key references public.app_users(id) on delete cascade,
  balance numeric(12, 2) not null default 0,
  currency text not null default 'PEN',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint wallets_balance_non_negative check (balance >= 0),
  constraint wallets_currency_allowed check (currency = 'PEN')
);

create table if not exists public.matches (
  id text primary key,
  start_time timestamptz not null,
  league_id text not null,
  league_name text not null,
  league_country text not null,
  home_team_id text not null,
  home_team_name text not null,
  home_team_short_name text not null,
  away_team_id text not null,
  away_team_name text not null,
  away_team_short_name text not null,
  market_type text not null default '1X2',
  odd_home numeric(8, 2) not null,
  odd_draw numeric(8, 2) not null,
  odd_away numeric(8, 2) not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint matches_market_type_allowed check (market_type = '1X2'),
  constraint matches_odd_home_positive check (odd_home > 0),
  constraint matches_odd_draw_positive check (odd_draw > 0),
  constraint matches_odd_away_positive check (odd_away > 0)
);

create table if not exists public.bets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  match_id text not null references public.matches(id) on delete restrict,
  placed_at timestamptz not null,
  pick text not null,
  odd numeric(8, 2) not null,
  stake numeric(12, 2) not null,
  status text not null,
  return_amount numeric(12, 2),
  source text not null default 'user',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint bets_pick_allowed check (pick in ('HOME', 'DRAW', 'AWAY')),
  constraint bets_status_allowed check (status in ('PENDING', 'WON', 'LOST')),
  constraint bets_source_allowed check (source in ('seed', 'user')),
  constraint bets_odd_positive check (odd > 0),
  constraint bets_stake_positive check (stake > 0),
  constraint bets_return_amount_non_negative check (
    return_amount is null or return_amount >= 0
  )
);

create index if not exists app_users_email_idx on public.app_users (email);
create index if not exists app_users_provider_account_idx
  on public.app_users (provider, provider_account_id);
create index if not exists matches_start_time_idx on public.matches (start_time);
create index if not exists bets_user_id_idx on public.bets (user_id);
create index if not exists bets_match_id_idx on public.bets (match_id);
create index if not exists bets_user_id_placed_at_idx
  on public.bets (user_id, placed_at desc);
