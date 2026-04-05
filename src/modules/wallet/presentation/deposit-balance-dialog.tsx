'use client';

import { useId, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { depositBalanceAction } from '@/modules/wallet/presentation/deposit-balance.action';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';

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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const amountErrorId = useId();

  const parsedAmount = useMemo(() => {
    if (amount.trim().length === 0) return 0;
    return Number(amount);
  }, [amount]);

  function handleQuickAmountClick(value: number) {
    const nextValue = parsedAmount + value;
    setErrorMessage(null);
    setAmount(nextValue.toString());
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await depositBalanceAction(parsedAmount);

    setIsSubmitting(false);

    if (!result.ok) {
      setErrorMessage(result.errorMessage);
      toast.error(result.errorMessage);
      return;
    }

    setOpen(false);
    setAmount('');
    router.refresh();

    toast.success(`Saldo actualizado a S/ ${result.wallet.balance.toFixed(2)}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`Abrir dialogo para agregar saldo. Saldo actual S/ ${currentBalance.toFixed(2)}`}
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
              aria-invalid={errorMessage !== null}
              aria-describedby={errorMessage ? amountErrorId : undefined}
            />
          </div>

          {errorMessage ? (
            <p
              id={amountErrorId}
              className="text-danger text-sm"
              aria-live="polite"
            >
              {errorMessage}
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Actualizando...' : 'Confirmar depósito'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
