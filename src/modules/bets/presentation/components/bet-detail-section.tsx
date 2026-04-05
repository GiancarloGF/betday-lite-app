import { format, parseISO } from 'date-fns';
import {
  CalendarClockIcon,
  MapPinnedIcon,
  TargetIcon,
  TicketIcon,
  TrophyIcon,
} from 'lucide-react';

import type { Bet, BetPick, BetStatus } from '@/modules/bets/domain/bet';
import type { Match } from '@/modules/matches/domain/match';
import { BetNotFound } from '@/modules/bets/presentation/components/bet-not-found';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

type BetDetailSectionProps = {
  bet: Bet | null;
  match?: Match;
};

const PICK_LABELS: Record<BetPick, string> = {
  HOME: '1',
  DRAW: 'X',
  AWAY: '2',
};

const STATUS_VARIANTS: Record<
  BetStatus,
  'secondary' | 'default' | 'destructive'
> = {
  PENDING: 'secondary',
  WON: 'default',
  LOST: 'destructive',
};

function getStatusLabel(status: BetStatus): string {
  if (status === 'WON') return 'Ganada';
  if (status === 'LOST') return 'Perdida';
  return 'Pendiente';
}

function getHeadline(status: BetStatus, totalPayout: number | null): string {
  if (status === 'WON' && totalPayout !== null) {
    return `GANADA · Retorno S/ ${totalPayout.toFixed(2)}`;
  }

  if (status === 'LOST') {
    return 'PERDIDA · Sin retorno';
  }

  return 'PENDIENTE · En espera de resultado';
}

function getPickDescription(pick: BetPick, match?: Match): string {
  if (!match) {
    if (pick === 'HOME') return 'Victoria del equipo local';
    if (pick === 'AWAY') return 'Victoria del equipo visitante';
    return 'Empate al final del partido';
  }

  if (pick === 'HOME') return `${match.homeTeam.name} gana el partido`;
  if (pick === 'AWAY') return `${match.awayTeam.name} gana el partido`;
  return 'Empate al final del partido';
}

function getNetResult(bet: Bet): string {
  if (bet.return === null) {
    const expectedProfit = bet.stake * bet.odd - bet.stake;
    return `+ S/ ${expectedProfit.toFixed(2)}`;
  }

  const profit = bet.return - bet.stake;

  if (profit > 0) {
    return `+ S/ ${profit.toFixed(2)}`;
  }

  if (profit < 0) {
    return `- S/ ${Math.abs(profit).toFixed(2)}`;
  }

  return 'S/ 0.00';
}

function getTotalPayoutDisplay(bet: Bet): string {
  if (bet.return === null) {
    const expectedPayout = bet.stake * bet.odd;
    return `S/ ${expectedPayout.toFixed(2)}`;
  }

  return `S/ ${bet.return.toFixed(2)}`;
}

function getNetResultLabel(status: BetStatus): string {
  if (status === 'PENDING') {
    return 'Ganancia esperada';
  }

  return 'Ganancia';
}

function getTotalPayoutLabel(status: BetStatus): string {
  if (status === 'PENDING') {
    return 'Pago esperado';
  }

  return 'Pago total';
}

function getNetResultTone(
  status: BetStatus,
  totalPayout: number | null,
): string {
  if (status === 'WON' && totalPayout !== null) {
    return 'text-emerald-600';
  }

  if (status === 'LOST') {
    return 'text-red-600';
  }

  return 'text-foreground';
}

function getHeroSurfaceClasses(status: BetStatus): string {
  if (status === 'WON') {
    return 'border-emerald-200 bg-emerald-50/90 text-emerald-950';
  }

  if (status === 'LOST') {
    return 'border-red-200 bg-red-50/90 text-red-950';
  }

  return 'border-slate-200 bg-slate-100/90 text-slate-900';
}

function getStatusChipClasses(status: BetStatus): string {
  if (status === 'WON') {
    return 'border-emerald-300 bg-emerald-50 text-emerald-700';
  }

  if (status === 'LOST') {
    return 'border-red-300 bg-red-50 text-red-700';
  }

  return 'border-slate-300 bg-slate-100 text-slate-600';
}

function getTeamInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Displays detailed information for a selected bet.
 */
export function BetDetailSection({ bet, match }: BetDetailSectionProps) {
  if (!bet) {
    return <BetNotFound />;
  }

  const placedAt = format(parseISO(bet.placedAt), 'dd/MM/yyyy HH:mm');
  const kickoffAt = match
    ? format(parseISO(match.startTime), 'dd/MM/yyyy HH:mm')
    : 'No disponible';
  const totalPayout = bet.return;
  const netResult = getNetResult(bet);
  const receiptCode = bet.id.slice(0, 8).toUpperCase();
  const heroSurfaceClasses = getHeroSurfaceClasses(bet.status);
  const statusChipClasses = getStatusChipClasses(bet.status);

  return (
    <section className="space-y-6">
      <div
        className={cn(
          'overflow-hidden rounded-[2rem] border shadow-[0_30px_55px_-32px_rgba(15,23,42,0.18)]',
          heroSurfaceClasses,
        )}
      >
        <div className="px-6 py-6 sm:px-7 sm:py-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    'bg-background/70 border backdrop-blur-sm',
                    statusChipClasses,
                  )}
                >
                  {getStatusLabel(bet.status)}
                </Badge>
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase opacity-70">
                  Boleta #{receiptCode}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold tracking-[0.24em] uppercase opacity-70">
                  Boleta registrada
                </p>
                <h2 className="mt-2 text-3xl leading-tight font-black tracking-tight sm:text-[2.65rem]">
                  {getHeadline(bet.status, totalPayout)}
                </h2>
              </div>
            </div>

            <div className="lg:min-w-76">
              <div className="bg-background/55 rounded-[1.35rem] border border-current/10 px-4 py-4 backdrop-blur-sm">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase opacity-70">
                  Mercado
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {match?.market.type === '1X2'
                    ? 'Ganador del partido'
                    : 'No definido'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrophyIcon className="text-brand h-4 w-4" />
          <h3 className="text-foreground text-base font-semibold">
            Detalles del partido
          </h3>
        </div>

        <div className="border-border bg-card rounded-[1.7rem] border border-white/70 p-5 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)]">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-3 text-center md:text-left">
              <div className="bg-surface-muted mx-auto flex h-18 w-18 items-center justify-center rounded-[1.35rem] border border-white/70 text-xl font-black text-slate-700 md:mx-0">
                {getTeamInitials(match?.homeTeam.name ?? 'EL')}
              </div>
              <div>
                <p className="text-foreground text-xl font-bold">
                  {match?.homeTeam.name ?? 'Equipo local'}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {match?.homeTeam.shortName ?? 'LOCAL'}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                VS
              </p>
              <p className="text-foreground text-sm font-semibold">
                {match?.league.name ?? 'Liga'}
              </p>
              <p className="text-muted-foreground text-sm">
                {match?.league.country ?? 'País'} · {kickoffAt}
              </p>
            </div>

            <div className="space-y-3 text-center md:text-right">
              <div className="bg-surface-muted mx-auto flex h-18 w-18 items-center justify-center rounded-[1.35rem] border border-white/70 text-xl font-black text-slate-700 md:mr-0 md:ml-auto">
                {getTeamInitials(match?.awayTeam.name ?? 'EV')}
              </div>
              <div>
                <p className="text-foreground text-xl font-bold">
                  {match?.awayTeam.name ?? 'Equipo visitante'}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {match?.awayTeam.shortName ?? 'VISITA'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TargetIcon className="text-brand h-4 w-4" />
          <h3 className="text-foreground text-base font-semibold">
            Análisis de la apuesta
          </h3>
        </div>

        <div className="border-border bg-card rounded-[1.7rem] border border-white/70 p-5 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                Mercado: Ganador del partido
              </p>
              <div className="space-y-2">
                <p className="text-foreground text-4xl font-black tracking-tight">
                  Selección: {PICK_LABELS[bet.pick]}
                </p>
                <p className="text-muted-foreground text-base">
                  {getPickDescription(bet.pick, match)}
                </p>
              </div>
            </div>

            <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50 px-4 py-4 text-left lg:min-w-44">
              <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                Cuota congelada
              </p>
              <p className="text-brand mt-2 text-4xl font-black tracking-tight">
                {bet.odd.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border-border bg-card rounded-[1.4rem] border border-white/70 px-4 py-4 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.24)]">
            <div className="flex items-start gap-3">
              <CalendarClockIcon className="text-muted-foreground mt-0.5 h-4 w-4" />
              <div>
                <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                  Fecha de apuesta
                </p>
                <p className="text-foreground mt-1 text-sm font-semibold">
                  {placedAt}
                </p>
              </div>
            </div>
          </div>

          <div className="border-border bg-card rounded-[1.4rem] border border-white/70 px-4 py-4 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.24)]">
            <div className="flex items-start gap-3">
              <MapPinnedIcon className="text-muted-foreground mt-0.5 h-4 w-4" />
              <div>
                <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                  Liga / país
                </p>
                <p className="text-foreground mt-1 text-sm font-semibold">
                  {match?.league.name ?? 'Liga'} ·{' '}
                  {match?.league.country ?? 'País'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-border bg-card grid gap-6 rounded-[1.7rem] border border-white/70 px-5 py-5 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)] sm:grid-cols-3 sm:px-6">
        <div>
          <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
            Monto apostado
          </p>
          <p className="text-foreground mt-3 text-4xl font-black tracking-tight">
            S/ {bet.stake.toFixed(2)}
          </p>
        </div>

        <div className="text-left sm:text-center">
          <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
            {getNetResultLabel(bet.status)}
          </p>
          <p
            className={cn(
              'mt-3 text-4xl font-black tracking-tight',
              getNetResultTone(bet.status, totalPayout),
            )}
          >
            {netResult}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
            {getTotalPayoutLabel(bet.status)}
          </p>
          <p className="text-foreground mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            {getTotalPayoutDisplay(bet)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border-border bg-card rounded-[1.4rem] border border-white/70 px-4 py-4 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.24)]">
          <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
            Estado
          </p>
          <div className="mt-3">
            <Badge variant={STATUS_VARIANTS[bet.status]}>
              {getStatusLabel(bet.status)}
            </Badge>
          </div>
        </div>

        <div className="border-border bg-card rounded-[1.4rem] border border-white/70 px-4 py-4 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.24)]">
          <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
            ID del partido
          </p>
          <div className="mt-3 flex items-center gap-2">
            <TicketIcon className="text-muted-foreground h-4 w-4" />
            <p className="text-foreground text-base font-semibold">
              {bet.matchId}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
