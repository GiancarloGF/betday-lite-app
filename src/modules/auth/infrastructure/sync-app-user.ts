import { mapSeedBetsForUser } from '@/modules/bets/infrastructure/seed-bets-bootstrap';
import { getSupabaseServerClient } from '@/shared/lib/supabase/server';

type SyncAppUserInput = {
  email: string;
  name: string | null | undefined;
  image: string | null | undefined;
  provider: string;
  providerAccountId: string;
};

/**
 * Upserts the application user, ensures a wallet exists,
 * and bootstraps seed bets on first successful login.
 */
export async function syncAppUser(input: SyncAppUserInput): Promise<string> {
  const supabase = getSupabaseServerClient();
  const now = new Date().toISOString();

  const { data: user, error: userError } = await supabase
    .from('app_users')
    .upsert(
      {
        email: input.email,
        display_name: input.name ?? null,
        avatar_url: input.image ?? null,
        provider: input.provider,
        provider_account_id: input.providerAccountId,
        updated_at: now,
      },
      {
        onConflict: 'email',
      },
    )
    .select('id, seeded_at')
    .single();

  if (userError || !user) {
    throw new Error(
      `Failed to sync app user for email ${input.email}: ${userError?.message ?? 'Missing user id'}`,
    );
  }

  const { error: walletError } = await supabase.from('wallets').upsert(
    {
      user_id: user.id,
      updated_at: now,
    },
    {
      onConflict: 'user_id',
    },
  );

  if (walletError) {
    throw new Error(
      `Failed to ensure wallet for app user ${user.id}: ${walletError.message}`,
    );
  }

  if (!user.seeded_at) {
    const { count, error: betsCountError } = await supabase
      .from('bets')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (betsCountError) {
      throw new Error(
        `Failed to inspect existing bets for app user ${user.id}: ${betsCountError.message}`,
      );
    }

    if ((count ?? 0) > 0) {
      throw new Error(
        `Seed bootstrap is inconsistent for app user ${user.id}: seeded_at is null but bets already exist`,
      );
    }

    const seedBets = mapSeedBetsForUser(user.id, now);

    const { error: seedBetsError } = await supabase
      .from('bets')
      .insert(seedBets);

    if (seedBetsError) {
      throw new Error(
        `Failed to bootstrap seed bets for app user ${user.id}: ${seedBetsError.message}`,
      );
    }

    const { error: seedMarkError } = await supabase
      .from('app_users')
      .update({
        seeded_at: now,
        updated_at: now,
      })
      .eq('id', user.id);

    if (seedMarkError) {
      throw new Error(
        `Failed to mark seed bootstrap for app user ${user.id}: ${seedMarkError.message}`,
      );
    }
  }

  return user.id;
}
