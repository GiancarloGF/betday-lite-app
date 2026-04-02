const WALLET_STORAGE_KEY = 'betday:wallet';

type WalletData = {
  balance: number;
  currency: 'PEN';
};

const DEFAULT_WALLET: WalletData = {
  balance: 0,
  currency: 'PEN',
};

export class LocalStorageWalletRepository {
  get(): WalletData {
    if (typeof window === 'undefined') return DEFAULT_WALLET;

    const data = localStorage.getItem(WALLET_STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_WALLET;
  }

  save(wallet: WalletData): void {
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
  }

  deposit(amount: number): WalletData {
    const wallet = this.get();
    const updated = {
      ...wallet,
      balance: wallet.balance + amount,
    };
    this.save(updated);
    return updated;
  }

  debit(amount: number): WalletData {
    const wallet = this.get();
    const updated = {
      ...wallet,
      balance: wallet.balance - amount,
    };
    this.save(updated);
    return updated;
  }
}
