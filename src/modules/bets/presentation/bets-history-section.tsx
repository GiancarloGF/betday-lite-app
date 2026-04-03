'use client';

import { useMemo, useState } from 'react';

import type { Bet, BetStatus } from '@/modules/bets/domain/bet';
import { BetHistoryCard } from '@/modules/bets/presentation/bet-history-card';
import { BetsEmptyState } from '@/modules/bets/presentation/bets-empty-state';
import type { Match } from '@/modules/matches/domain/match';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useUserBetsStore } from '@/shared/stores/user-bets.store';

type BetsHistorySectionProps = {
  seedBets: Bet[];
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

/**
 * Manages client-side filtering and combines seed bets with user bets.
 */
export function BetsHistorySection({
  seedBets,
  matches,
}: BetsHistorySectionProps) {
  const userBets = useUserBetsStore((state) => state.userBets);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BetStatus | 'ALL'>(
    'ALL',
  );

  const allBets = useMemo(() => {
    return [...seedBets, ...userBets].sort(
      (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
    );
  }, [seedBets, userBets]);

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
      <div className="grid gap-3 md:grid-cols-[1.5fr_220px]">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por equipo, liga o estado"
          aria-label="Buscar apuestas"
        />

        <Select
          value={selectedStatus}
          onValueChange={(value) =>
            setSelectedStatus(value as BetStatus | 'ALL')
          }
        >
          <SelectTrigger aria-label="Filtrar por estado">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>

          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status === 'ALL' ? 'Todos los estados' : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredBets.length === 0 ? (
        <BetsEmptyState />
      ) : (
        <div className="grid gap-4">
          {filteredBets.map(({ bet, match }) => (
            <BetHistoryCard key={bet.id} bet={bet} match={match} />
          ))}
        </div>
      )}
    </section>
  );
}
