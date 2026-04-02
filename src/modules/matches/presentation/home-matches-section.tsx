'use client';

import { useMemo, useState } from 'react';

import type { Match } from '../domain/match';
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
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');

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

      return matchesLeague && matchesTeam && matchesSearch;
    });
  }, [matches, search, selectedLeague, selectedTeam]);

  return (
    <section className="space-y-6">
      <MatchesFilters
        search={search}
        selectedLeague={selectedLeague}
        selectedTeam={selectedTeam}
        leagues={leagues}
        teams={teams}
        onSearchChange={setSearch}
        onLeagueChange={setSelectedLeague}
        onTeamChange={setSelectedTeam}
      />

      <MatchesList matches={filteredMatches} />
    </section>
  );
}
