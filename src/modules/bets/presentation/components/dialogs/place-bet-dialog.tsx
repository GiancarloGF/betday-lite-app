'use client';

import { getBalanceAction } from '@/modules/wallet/presentation/actions/get-balance.action';
import { placeBetAction } from '@/modules/bets/presentation/actions/place-bet.action';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { toast } from 'sonner';

import type { BetPick } from '@/modules/bets/domain/bet';
import type { Match } from '@/modules/matches/domain/match';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';

type PlaceBetDialogProps = {
  match: Match;
  pick: BetPick;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const PICK_LABELS: Record<BetPick, string> = {
  HOME: '1',
  DRAW: 'X',
  AWAY: '2',
};

/**
 * Handles stake input, estimated return and bet confirmation.
 */
export function PlaceBetDialog({
  match,
  pick,
  open,
  onOpenChange,
}: PlaceBetDialogProps) {
  const router = useRouter();
  const pulseTimeoutRef = useRef<number | null>(null);
  const [stake, setStake] = useState('');
  const [isReturnEmphasized, setIsReturnEmphasized] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const stakeErrorId = useId();

  const selectedOdd = (() => {
    if (pick === 'HOME') return match.market.odds.home;
    if (pick === 'DRAW') return match.market.odds.draw;
    return match.market.odds.away;
  })();

  const parsedStake = (() => {
    if (stake.trim().length === 0) return 0;
    return Number(stake);
  })();

  const estimatedReturn = (() => {
    if (!Number.isFinite(parsedStake) || parsedStake <= 0) return 0;
    return parsedStake * selectedOdd;
  })();

  useEffect(() => {
    return () => {
      if (pulseTimeoutRef.current !== null) {
        window.clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    let isCancelled = false;

    async function loadBalance() {
      setIsBalanceLoading(true);
      setErrorMessage(null);

      try {
        const wallet = await getBalanceAction();

        if (isCancelled) {
          return;
        }

        setCurrentBalance(wallet?.balance ?? null);
      } catch {
        if (isCancelled) {
          return;
        }

        setErrorMessage('No se pudo cargar el saldo actual');
      } finally {
        if (!isCancelled) {
          setIsBalanceLoading(false);
        }
      }
    }

    void loadBalance();

    return () => {
      isCancelled = true;
    };
  }, [open]);

  function triggerReturnEmphasis(nextStake: string) {
    if (!open || nextStake.trim().length === 0) {
      setIsReturnEmphasized(false);

      if (pulseTimeoutRef.current !== null) {
        window.clearTimeout(pulseTimeoutRef.current);
        pulseTimeoutRef.current = null;
      }

      return;
    }

    setIsReturnEmphasized(false);

    if (pulseTimeoutRef.current !== null) {
      window.clearTimeout(pulseTimeoutRef.current);
    }

    pulseTimeoutRef.current = window.setTimeout(() => {
      setIsReturnEmphasized(true);
      pulseTimeoutRef.current = null;
    }, 10);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setIsReturnEmphasized(false);
      setErrorMessage(null);
      setCurrentBalance(null);
      setIsBalanceLoading(false);

      if (pulseTimeoutRef.current !== null) {
        window.clearTimeout(pulseTimeoutRef.current);
        pulseTimeoutRef.current = null;
      }
    }

    onOpenChange(nextOpen);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await placeBetAction({
      matchId: match.id,
      pick,
      stake: parsedStake,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setErrorMessage(result.errorMessage);
      toast.error(result.errorMessage);
      return;
    }

    handleOpenChange(false);
    setStake('');

    toast.success(
      `Apuesta registrada: ${PICK_LABELS[result.bet.pick]} @ ${result.bet.odd.toFixed(2)}`,
    );

    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="motion-scale-fade-enter w-[calc(100vw-2rem)] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Confirmar apuesta
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-surface-muted rounded-[1.4rem] border border-white/70 p-4">
            <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
              Partido
            </p>
            <p className="text-foreground mt-1 text-base font-semibold">
              {match.homeTeam.name} vs {match.awayTeam.name}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border-border bg-muted/45 rounded-[1.25rem] border p-4">
              <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                Selección
              </p>
              <p className="text-foreground mt-1 text-lg font-bold">
                {PICK_LABELS[pick]}
              </p>
            </div>

            <div className="border-border bg-muted/45 rounded-[1.25rem] border p-4">
              <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                Cuota
              </p>
              <p className="text-foreground mt-1 text-lg font-bold">
                {selectedOdd.toFixed(2)}
              </p>
            </div>

            <div className="border-border bg-muted/45 rounded-[1.25rem] border p-4">
              <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                Saldo
              </p>
              <p className="text-foreground mt-1 text-lg font-bold">
                {isBalanceLoading || currentBalance === null
                  ? 'Cargando...'
                  : `S/ ${currentBalance.toFixed(2)}`}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="stake"
              className="text-foreground text-xs font-semibold tracking-[0.18em] uppercase"
            >
              Stake
            </label>

            <Input
              id="stake"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="1"
              max="500"
              value={stake}
              onChange={(event) => {
                const nextStake = event.target.value;

                setErrorMessage(null);
                setStake(nextStake);
                triggerReturnEmphasis(nextStake);
              }}
              placeholder="Ingresa tu stake"
              aria-invalid={errorMessage !== null}
              aria-describedby={errorMessage ? stakeErrorId : undefined}
              required
            />
          </div>

          {errorMessage ? (
            <p
              id={stakeErrorId}
              className="text-danger text-sm"
              aria-live="polite"
            >
              {errorMessage}
            </p>
          ) : null}

          <div
            className={cn(
              'bg-surface-muted rounded-[1.4rem] border border-white/70 p-4 text-sm',
              isReturnEmphasized && 'motion-soft-pulse',
            )}
          >
            <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
              Retorno estimado
            </p>
            <p className="text-foreground mt-1 text-xl font-bold">
              S/ {estimatedReturn.toFixed(2)}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={
              isSubmitting || isBalanceLoading || currentBalance === null
            }
          >
            {isSubmitting ? 'Registrando...' : 'Confirmar apuesta'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
