import { format, parseISO } from 'date-fns';

import type { Match } from '../domain/match';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BetPick } from '@/modules/bets/domain/bet';
import { PlaceBetDialog } from '@/modules/bets/presentation/place-bet-dialog';

const PICK_LABELS: Record<BetPick, string> = {
  HOME: '1',
  DRAW: 'X',
  AWAY: '2',
};

/**
 * MatchCard renders the main betting information for a single match.
 */
export function MatchCard({ match }: { match: Match }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [selectedPick, setSelectedPick] = useState<BetPick | null>(null);
  const [isBetDialogOpen, setIsBetDialogOpen] = useState(false);

  const startTime = format(parseISO(match.startTime), 'HH:mm');

  function handlePickSelection(pick: BetPick) {
    if (status !== 'authenticated') {
      router.push('/login?callbackUrl=/');
      return;
    }

    setSelectedPick(pick);
    setIsBetDialogOpen(true);
  }

  return (
    <>
      <article className="border-border bg-card rounded-[1.5rem] border border-white/70 p-4 shadow-[0_20px_38px_-30px_rgba(15,23,42,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_26px_46px_-32px_rgba(15,23,42,0.28)]">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-brand text-[11px] font-semibold tracking-[0.2em] uppercase">
              {match.league.name}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {match.league.country}
            </p>
          </div>

          <div className="bg-surface-muted text-foreground rounded-full border border-white px-3 py-1 text-xs font-semibold">
            {startTime}
          </div>
        </div>

        <div className="bg-muted/55 mb-3 rounded-[1.2rem] px-4 py-3.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-foreground text-base font-semibold">
                {match.homeTeam.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {match.homeTeam.shortName}
              </p>
            </div>

            <span className="text-muted-foreground text-xs font-semibold tracking-[0.24em] uppercase">
              vs
            </span>

            <div className="text-right">
              <p className="text-foreground text-base font-semibold">
                {match.awayTeam.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {match.awayTeam.shortName}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handlePickSelection('HOME')}
            className="border-border bg-surface hover:border-brand hover:bg-brand hover:[&_span]:text-brand-foreground rounded-[1rem] border px-3 py-2.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-colors"
          >
            <span className="text-muted-foreground block text-[11px] font-semibold tracking-[0.18em] uppercase">
              {PICK_LABELS.HOME}
            </span>
            <span className="text-foreground mt-0.5 block text-lg font-bold">
              {match.market.odds.home.toFixed(2)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handlePickSelection('DRAW')}
            className="border-border bg-surface hover:border-brand hover:bg-brand hover:[&_span]:text-brand-foreground rounded-[1rem] border px-3 py-2.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-colors"
          >
            <span className="text-muted-foreground block text-[11px] font-semibold tracking-[0.18em] uppercase">
              {PICK_LABELS.DRAW}
            </span>
            <span className="text-foreground mt-0.5 block text-lg font-bold">
              {match.market.odds.draw.toFixed(2)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handlePickSelection('AWAY')}
            className="border-border bg-surface hover:border-brand hover:bg-brand hover:[&_span]:text-brand-foreground rounded-[1rem] border px-3 py-2.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-colors"
          >
            <span className="text-muted-foreground block text-[11px] font-semibold tracking-[0.18em] uppercase">
              {PICK_LABELS.AWAY}
            </span>
            <span className="text-foreground mt-0.5 block text-lg font-bold">
              {match.market.odds.away.toFixed(2)}
            </span>
          </button>
        </div>
      </article>
      {session?.user?.id && selectedPick ? (
        <PlaceBetDialog
          match={match}
          pick={selectedPick}
          userId={session.user.id}
          open={isBetDialogOpen}
          onOpenChange={setIsBetDialogOpen}
        />
      ) : null}
    </>
  );
}
