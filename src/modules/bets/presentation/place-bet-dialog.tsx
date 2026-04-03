'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
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
  const [stake, setStake] = useState('');
  const { wallet, refreshWallet } = useWalletStore();
  const addUserBet = useUserBetsStore((state) => state.addUserBet);

  const selectedOdd = useMemo(() => {
    if (pick === 'HOME') return match.market.odds.home;
    if (pick === 'DRAW') return match.market.odds.draw;
    return match.market.odds.away;
  }, [match, pick]);

  const parsedStake = useMemo(() => {
    if (stake.trim().length === 0) return 0;
    return Number(stake);
  }, [stake]);

  const estimatedReturn = useMemo(() => {
    if (!Number.isFinite(parsedStake) || parsedStake <= 0) return 0;
    return parsedStake * selectedOdd;
  }, [parsedStake, selectedOdd]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const bet = await placeBet({
        matchId: match.id,
        pick,
        stake: parsedStake,
        userId,
      });

      addUserBet(bet);

      refreshWallet();

      onOpenChange(false);
      setStake('');

      toast.success(
        `Apuesta registrada: ${PICK_LABELS[bet.pick]} @ ${bet.odd.toFixed(2)}`,
      );

      router.refresh();
    } catch (error) {
      if (error instanceof AppError) {
        toast.error(error.message);
        return;
      }

      toast.error('No se pudo registrar la apuesta');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-lg">
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
              onChange={(event) => setStake(event.target.value)}
              placeholder="Ingresa tu stake"
              required
            />
          </div>

          <div className="bg-surface-muted rounded-[1.4rem] border border-white/70 p-4 text-sm">
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
