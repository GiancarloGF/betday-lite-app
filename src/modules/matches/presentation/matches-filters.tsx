'use client';

import { formatMatchDateLabel } from '@/modules/matches/presentation/match-date.utils';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { SlidersHorizontalIcon } from 'lucide-react';

type MatchesFiltersProps = {
  search: string;
  selectedDate: string;
  selectedLeague: string;
  selectedTeam: string;
  dates: string[];
  leagues: string[];
  teams: string[];
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onLeagueChange: (value: string) => void;
  onTeamChange: (value: string) => void;
};

/**
 * Renders search and filter controls for the matches timeline.
 */
export function MatchesFilters({
  search,
  selectedDate,
  selectedLeague,
  selectedTeam,
  dates,
  leagues,
  teams,
  onSearchChange,
  onDateChange,
  onLeagueChange,
  onTeamChange,
}: MatchesFiltersProps) {
  function renderSearchField(inputClassName: string) {
    return (
      <div className="space-y-2">
        <label
          htmlFor="matches-search"
          className="text-foreground text-xs font-semibold tracking-[0.18em] uppercase"
        >
          Buscar
        </label>

        <Input
          id="matches-search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por equipo o liga"
          aria-label="Buscar partidos"
          className={inputClassName}
        />
      </div>
    );
  }

  function renderFilters() {
    return (
      <>
        <div className="space-y-2">
          <p className="text-foreground text-xs font-semibold tracking-[0.18em] uppercase">
            Fecha
          </p>

          <Select value={selectedDate} onValueChange={onDateChange}>
            <SelectTrigger
              aria-label="Filtrar por fecha"
              className="w-full min-w-0"
            >
              <SelectValue placeholder="Todas las fechas" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todas las fechas</SelectItem>

              {dates.map((date) => (
                <SelectItem key={date} value={date}>
                  {formatMatchDateLabel(date)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-foreground text-xs font-semibold tracking-[0.18em] uppercase">
            Liga
          </p>

          <Select value={selectedLeague} onValueChange={onLeagueChange}>
            <SelectTrigger
              aria-label="Filtrar por liga"
              className="w-full min-w-0"
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
        </div>

        <div className="space-y-2">
          <p className="text-foreground text-xs font-semibold tracking-[0.18em] uppercase">
            Equipo
          </p>

          <Select value={selectedTeam} onValueChange={onTeamChange}>
            <SelectTrigger
              aria-label="Filtrar por equipo"
              className="w-full min-w-0"
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
      </>
    );
  }

  return (
    <div className="bg-card rounded-[1.6rem] border border-white/70 p-4 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)]">
      <div className="space-y-2 lg:hidden">
        <label
          htmlFor="matches-search"
          className="text-foreground text-xs font-semibold tracking-[0.18em] uppercase"
        >
          Buscar
        </label>

        <div className="flex items-center gap-3">
          <Input
            id="matches-search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por equipo o liga"
            aria-label="Buscar partidos"
            className="min-w-0 flex-1"
          />

          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Abrir filtros"
              >
                <SlidersHorizontalIcon />
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Filtros</DialogTitle>
                <DialogDescription>
                  Filtra los eventos por fecha, liga o equipo.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">{renderFilters()}</div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-3">
        {renderSearchField('min-w-0 w-full')}
        {renderFilters()}
      </div>
    </div>
  );
}
