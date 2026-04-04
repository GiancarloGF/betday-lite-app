import type { Wallet } from '@/modules/wallet/domain/wallet';
import { getSupabaseServerClient } from '@/shared/lib/supabase/server';

type WalletRow = {
  user_id: string;
  balance: number;
  currency: 'PEN';
};

function mapWalletRowToDomain(row: WalletRow): Wallet {
  return {
    balance: Number(row.balance),
    currency: row.currency,
  };
}

export class SupabaseWalletRepository {
  async getByUserId(userId: string): Promise<Wallet> {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('wallets')
      .select('user_id, balance, currency')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new Error(
        `Failed to read wallet for user ${userId}: ${error?.message ?? 'Wallet not found'}`,
      );
    }

    return mapWalletRowToDomain(data as WalletRow);
  }

  async deposit(userId: string, amount: number): Promise<Wallet> {
    const supabase = getSupabaseServerClient();

    const wallet = await this.getByUserId(userId);
    const nextBalance = wallet.balance + amount;

    const { data, error } = await supabase
      .from('wallets')
      .update({
        balance: nextBalance,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select('user_id, balance, currency')
      .single();

    if (error || !data) {
      throw new Error(
        `Failed to deposit into wallet for user ${userId}: ${error?.message ?? 'Wallet update failed'}`,
      );
    }

    return mapWalletRowToDomain(data as WalletRow);
  }

  async debit(userId: string, amount: number): Promise<Wallet> {
    const supabase = getSupabaseServerClient();

    const wallet = await this.getByUserId(userId);
    const nextBalance = wallet.balance - amount;

    const { data, error } = await supabase
      .from('wallets')
      .update({
        balance: nextBalance,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select('user_id, balance, currency')
      .single();

    if (error || !data) {
      throw new Error(
        `Failed to debit wallet for user ${userId}: ${error?.message ?? 'Wallet update failed'}`,
      );
    }

    return mapWalletRowToDomain(data as WalletRow);
  }
}
