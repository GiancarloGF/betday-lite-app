'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { toast } from 'sonner';

import { placeBet } from '@/modules/bets/application/place-bet.use-case';
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
import { AppError } from '@/shared/errors/app-error';
import { cn } from '@/shared/lib/utils';
import { useUserBetsStore } from '@/shared/stores/user-bets.store';
import { useWalletStore } from '@/shared/stores/wallet.store';

type PlaceBetDialogProps = {
  match: Match;
  pick: BetPick;
  userId: string;
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
  userId,
  open,
  onOpenChange,
}: PlaceBetDialogProps) {
  const router = useRouter();
  const pulseTimeoutRef = useRef<number | null>(null);
  const [stake, setStake] = useState('');
  const [isReturnEmphasized, setIsReturnEmphasized] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const stakeErrorId = useId();
  const { wallet, refreshWallet } = useWalletStore();
  const addUserBet = useUserBetsStore((state) => state.addUserBet);

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

    try {
      const bet = await placeBet({
        matchId: match.id,
        pick,
        stake: parsedStake,
        userId,
      });

      addUserBet(bet);

      refreshWallet();

      handleOpenChange(false);
      setStake('');

      toast.success(
        `Apuesta registrada: ${PICK_LABELS[bet.pick]} @ ${bet.odd.toFixed(2)}`,
      );

      router.refresh();
    } catch (error) {
      if (error instanceof AppError) {
        setErrorMessage(error.message);
        toast.error(error.message);
        return;
      }

      setErrorMessage('No se pudo registrar la apuesta');
      toast.error('No se pudo registrar la apuesta');
    }
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
                S/ {wallet.balance.toFixed(2)}
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

          <Button type="submit" className="w-full" size="lg">
            Confirmar apuesta
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
