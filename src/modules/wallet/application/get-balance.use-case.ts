import type { Wallet } from '@/modules/wallet/domain/wallet';
import { SupabaseWalletRepository } from '@/modules/wallet/infrastructure/supabase-wallet.repository';

type GetBalanceInput = {
  userId: string;
};

/**
 * Returns the current server-authoritative wallet for a user.
 */
export async function getBalanceUseCase(
  input: GetBalanceInput,
): Promise<Wallet> {
  const walletRepository = new SupabaseWalletRepository();

  return walletRepository.getByUserId(input.userId);
}
