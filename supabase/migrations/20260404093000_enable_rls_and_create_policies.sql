alter table public.app_users enable row level security;
alter table public.wallets enable row level security;
alter table public.matches enable row level security;
alter table public.bets enable row level security;

create policy "matches_are_public_read_only"
on public.matches
for select
to anon, authenticated
using (true);

create policy "matches_service_role_write"
on public.matches
for all
to service_role
using (true)
with check (true);

create policy "app_users_service_role_only"
on public.app_users
for all
to service_role
using (true)
with check (true);

create policy "wallets_service_role_only"
on public.wallets
for all
to service_role
using (true)
with check (true);

create policy "bets_service_role_only"
on public.bets
for all
to service_role
using (true)
with check (true);
