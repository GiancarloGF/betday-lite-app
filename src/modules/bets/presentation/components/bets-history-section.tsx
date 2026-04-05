'use client';

import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

import type { Bet, BetPick, BetStatus } from '@/modules/bets/domain/bet';
import { BetsEmptyState } from '@/modules/bets/presentation/components/bets-empty-state';
import type { Match } from '@/modules/matches/domain/match';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

type BetsHistorySectionProps = {
  bets: Bet[];
  matches: Match[];
};

type EnrichedBet = {
  bet: Bet;
  match?: Match;
};

const STATUS_OPTIONS: Array<BetStatus | 'ALL'> = [
  'ALL',
  'PENDING',
  'WON',
  'LOST',
];

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
  if (status === 'PENDING') return 'Pendiente';
  if (status === 'WON') return 'Ganada';
  return 'Perdida';
}

function getStatusTabLabel(status: BetStatus | 'ALL'): string {
  if (status === 'ALL') return 'Todas';
  if (status === 'PENDING') return 'Pendientes';
  if (status === 'WON') return 'Ganadas';
  return 'Perdidas';
}

/**
 * Manages client-side filtering and combines seed bets with user bets.
 */
export function BetsHistorySection({ bets, matches }: BetsHistorySectionProps) {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BetStatus | 'ALL'>(
    'ALL',
  );

  const allBets = useMemo(() => {
    return [...bets].sort(
      (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
    );
  }, [bets]);

  const enrichedBets = useMemo<EnrichedBet[]>(() => {
    return allBets.map((bet) => ({
      bet,
      match: matches.find((match) => match.id === bet.matchId),
    }));
  }, [allBets, matches]);

  const filteredBets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return enrichedBets.filter(({ bet, match }) => {
      const matchesStatus =
        selectedStatus === 'ALL' || bet.status === selectedStatus;

      const searchableValues = [
        match?.homeTeam.name ?? '',
        match?.awayTeam.name ?? '',
        match?.league.name ?? '',
        bet.pick,
        bet.status,
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        searchableValues.includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [enrichedBets, search, selectedStatus]);

  return (
    <section className="space-y-6">
      <div className="bg-card rounded-[1.6rem] border border-white/70 p-4 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Tabs
            value={selectedStatus}
            onValueChange={(value) =>
              setSelectedStatus(value as BetStatus | 'ALL')
            }
            className="w-full lg:w-auto"
          >
            <TabsList className="bg-muted h-auto rounded-2xl p-1">
              {STATUS_OPTIONS.map((status) => (
                <TabsTrigger
                  key={status}
                  value={status}
                  className="data-active:bg-card data-active:text-foreground min-w-20 rounded-xl px-4 py-2.5 text-sm font-semibold normal-case after:hidden data-active:shadow-[0_12px_24px_-20px_rgba(15,23,42,0.5)]"
                >
                  {getStatusTabLabel(status)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por equipo o liga..."
            aria-label="Buscar apuestas"
            className="w-full lg:max-w-sm"
          />
        </div>
      </div>

      {filteredBets.length === 0 ? (
        <BetsEmptyState />
      ) : (
        <div className="bg-card overflow-hidden rounded-[1.6rem] border border-white/70 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/70 hover:bg-muted/70">
                <TableHead className="rounded-tl-[1.6rem]">
                  Detalles del partido
                </TableHead>
                <TableHead>Selección</TableHead>
                <TableHead>Cuota</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha/Hora</TableHead>
                <TableHead className="rounded-tr-[1.6rem] text-right">
                  Acción
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredBets.map(({ bet, match }) => {
                const placedAt = parseISO(bet.placedAt);

                return (
                  <TableRow key={bet.id} className="bg-card hover:bg-muted/20">
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <p className="text-foreground text-base font-medium">
                          {match?.homeTeam.name ?? 'Equipo local'} vs{' '}
                          {match?.awayTeam.name ?? 'Equipo visitante'}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {match?.league.name ?? 'Liga'}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="min-w-9 justify-center rounded-lg px-3 tracking-normal"
                      >
                        {PICK_LABELS[bet.pick]}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-foreground text-[1.75rem] leading-none font-semibold">
                      {bet.odd.toFixed(2)}
                    </TableCell>

                    <TableCell className="text-foreground text-[1.75rem] leading-none font-semibold">
                      ${bet.stake.toFixed(2)}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={STATUS_VARIANTS[bet.status]}
                        className="tracking-normal"
                      >
                        {getStatusLabel(bet.status)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <p className="text-foreground text-sm font-semibold">
                          {format(placedAt, 'dd MMM, yyyy', { locale: es })}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {format(placedAt, 'HH:mm')}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="relative z-10"
                      >
                        <Link
                          href={`/bets/${bet.id}`}
                          aria-label={`Ver detalle de la apuesta para ${match?.homeTeam.name ?? 'Equipo local'} vs ${match?.awayTeam.name ?? 'Equipo visitante'}`}
                        >
                          Ver detalle
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
