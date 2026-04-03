'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { AppError } from '@/shared/errors/app-error';
import { useWalletStore } from '@/shared/stores/wallet.store';

type DepositBalanceDialogProps = {
  currentBalance: number;
};

const QUICK_AMOUNTS = [20, 50, 100];

/**
 * Allows the user to add fake balance through a small responsive dialog.
 */
export function DepositBalanceDialog({
  currentBalance,
}: DepositBalanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const depositToWallet = useWalletStore((state) => state.depositToWallet);

  const parsedAmount = useMemo(() => {
    if (amount.trim().length === 0) return 0;
    return Number(amount);
  }, [amount]);

  function handleQuickAmountClick(value: number) {
    const nextValue = parsedAmount + value;
    setAmount(nextValue.toString());
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const wallet = depositToWallet(parsedAmount);

      setOpen(false);
      setAmount('');

      toast.success(`Saldo actualizado a S/ ${wallet.balance.toFixed(2)}`);
    } catch (error) {
      if (error instanceof AppError) {
        toast.error(error.message);
        return;
      }

      toast.error('No se pudo actualizar el saldo');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="bg-surface-muted text-foreground hover:bg-accent rounded-full border border-white px-4 py-2 text-sm font-semibold shadow-[0_10px_24px_-20px_rgba(15,23,42,0.45)] transition-colors"
        >
          S/ {currentBalance.toFixed(2)}
        </button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100vw-2rem)] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Agregar saldo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-surface-muted text-muted-foreground rounded-[1.4rem] border border-white/70 p-4 text-sm">
            Saldo actual:{' '}
            <span className="text-foreground font-semibold">
              S/ {currentBalance.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {QUICK_AMOUNTS.map((quickAmount) => (
              <Button
                key={quickAmount}
                type="button"
                variant="outline"
                onClick={() => handleQuickAmountClick(quickAmount)}
                className="w-full"
              >
                S/ {quickAmount}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="deposit-amount"
              className="text-foreground text-xs font-semibold tracking-[0.18em] uppercase"
            >
              Monto
            </label>

            <Input
              id="deposit-amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Confirmar depósito
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
