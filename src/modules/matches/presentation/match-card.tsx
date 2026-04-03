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
      <article className="border-border bg-card rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-brand text-xs font-medium tracking-wide uppercase">
              {match.league.name}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {match.league.country}
            </p>
          </div>

          <div className="bg-surface-muted text-foreground rounded-xl px-3 py-1 text-sm font-semibold">
            {startTime}
          </div>
        </div>

        <div className="mb-5 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-foreground text-base font-semibold">
                {match.homeTeam.name}
              </p>
              <p className="text-muted-foreground text-sm">
                {match.homeTeam.shortName}
              </p>
            </div>

            <span className="text-muted-foreground text-sm font-medium">
              vs
            </span>

            <div className="text-right">
              <p className="text-foreground text-base font-semibold">
                {match.awayTeam.name}
              </p>
              <p className="text-muted-foreground text-sm">
                {match.awayTeam.shortName}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handlePickSelection('HOME')}
            className="border-border bg-surface hover:border-brand hover:bg-surface-muted rounded-xl border px-3 py-3 text-left transition-colors"
          >
            <span className="text-muted-foreground block text-xs font-medium tracking-wide uppercase">
              {PICK_LABELS.HOME}
            </span>
            <span className="text-foreground mt-1 block text-lg font-bold">
              {match.market.odds.home.toFixed(2)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handlePickSelection('DRAW')}
            className="border-border bg-surface hover:border-brand hover:bg-surface-muted rounded-xl border px-3 py-3 text-left transition-colors"
          >
            <span className="text-muted-foreground block text-xs font-medium tracking-wide uppercase">
              {PICK_LABELS.DRAW}
            </span>
            <span className="text-foreground mt-1 block text-lg font-bold">
              {match.market.odds.draw.toFixed(2)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handlePickSelection('AWAY')}
            className="border-border bg-surface hover:border-brand hover:bg-surface-muted rounded-xl border px-3 py-3 text-left transition-colors"
          >
            <span className="text-muted-foreground block text-xs font-medium tracking-wide uppercase">
              {PICK_LABELS.AWAY}
            </span>
            <span className="text-foreground mt-1 block text-lg font-bold">
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
