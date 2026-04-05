'use client';

import { useMemo, useState } from 'react';

import type { Match } from '../../domain/match';
import { getMatchDateKey, getMatchDateKeys } from '../match-date.utils';
import { MatchesFilters } from './matches-filters';
import { MatchesList } from './matches-list';

type HomeMatchesSectionProps = {
  matches: Match[];
};

/**
 * Manages client-side search and filtering for the matches timeline.
 */
export function HomeMatchesSection({ matches }: HomeMatchesSectionProps) {
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('all');
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const dates = useMemo(() => {
    return getMatchDateKeys(matches);
  }, [matches]);

  const leagues = useMemo(() => {
    return [...new Set(matches.map((match) => match.league.name))].sort();
  }, [matches]);

  const teams = useMemo(() => {
    return [
      ...new Set(
        matches.flatMap((match) => [match.homeTeam.name, match.awayTeam.name]),
      ),
    ].sort();
  }, [matches]);

  const filteredMatches = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return matches.filter((match) => {
      const matchesDate =
        selectedDate === 'all' || getMatchDateKey(match) === selectedDate;

      const matchesLeague =
        selectedLeague === 'all' || match.league.name === selectedLeague;

      const matchesTeam =
        selectedTeam === 'all' ||
        match.homeTeam.name === selectedTeam ||
        match.awayTeam.name === selectedTeam;

      const searchableValues = [
        match.homeTeam.name,
        match.awayTeam.name,
        match.homeTeam.shortName,
        match.awayTeam.shortName,
        match.league.name,
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        searchableValues.includes(normalizedSearch);

      return matchesDate && matchesLeague && matchesTeam && matchesSearch;
    });
  }, [matches, search, selectedDate, selectedLeague, selectedTeam]);

  return (
    <section className="flex flex-col gap-5">
      <MatchesFilters
        search={search}
        selectedDate={selectedDate}
        selectedLeague={selectedLeague}
        selectedTeam={selectedTeam}
        dates={dates}
        leagues={leagues}
        teams={teams}
        onSearchChange={setSearch}
        onDateChange={setSelectedDate}
        onLeagueChange={setSelectedLeague}
        onTeamChange={setSelectedTeam}
      />

      <MatchesList matches={filteredMatches} />
    </section>
  );
}
