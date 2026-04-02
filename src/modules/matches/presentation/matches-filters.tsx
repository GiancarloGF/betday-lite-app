'use client';

import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

type MatchesFiltersProps = {
  search: string;
  selectedLeague: string;
  selectedTeam: string;
  leagues: string[];
  teams: string[];
  onSearchChange: (value: string) => void;
  onLeagueChange: (value: string) => void;
  onTeamChange: (value: string) => void;
};

/**
 * Renders search and filter controls for the matches timeline.
 */
export function MatchesFilters({
  search,
  selectedLeague,
  selectedTeam,
  leagues,
  teams,
  onSearchChange,
  onLeagueChange,
  onTeamChange,
}: MatchesFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por equipo o liga"
        aria-label="Buscar partidos"
      />

      <Select value={selectedLeague} onValueChange={onLeagueChange}>
        <SelectTrigger aria-label="Filtrar por liga">
          <SelectValue placeholder="Todas las ligas" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">Todas las ligas</SelectItem>

          {leagues.map((league) => (
            <SelectItem key={league} value={league}>
              {league}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedTeam} onValueChange={onTeamChange}>
        <SelectTrigger aria-label="Filtrar por equipo">
          <SelectValue placeholder="Todos los equipos" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">Todos los equipos</SelectItem>

          {teams.map((team) => (
            <SelectItem key={team} value={team}>
              {team}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
