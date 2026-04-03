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
    <div className="bg-card rounded-[1.6rem] border border-white/70 p-4 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por equipo o liga"
          aria-label="Buscar partidos"
          className="min-w-0 flex-1"
        />

        <div className="flex flex-col gap-3 lg:ml-auto lg:flex-row">
          <Select value={selectedLeague} onValueChange={onLeagueChange}>
            <SelectTrigger
              aria-label="Filtrar por liga"
              className="w-full lg:min-w-44"
            >
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
            <SelectTrigger
              aria-label="Filtrar por equipo"
              className="w-full lg:min-w-52"
            >
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
      </div>
    </div>
  );
}
