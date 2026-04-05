import type { Wallet } from '@/modules/wallet/domain/wallet';
import { SupabaseWalletRepository } from '@/modules/wallet/infrastructure/supabase-wallet.repository';
import { validateDepositAmount } from '@/shared/validations/wallet.validation';

/**
 * Deposits balance into the server-authoritative wallet.
 */
export async function depositBalanceUseCase({
  amount,
  userId,
}: {
  amount: number;
  userId: string;
}): Promise<Wallet> {
  validateDepositAmount(amount);

  const walletRepository = new SupabaseWalletRepository();

  return walletRepository.deposit(userId, amount);
}
