/**
 * Renders an empty state when no bets match the current filters.
 */
export function BetsEmptyState() {
  return (
    <div className="border-border bg-card rounded-2xl border border-dashed p-8 text-center">
      <p className="text-foreground text-base font-semibold">
        No hay apuestas para mostrar
      </p>
      <p className="text-muted-foreground mt-2 text-sm">
        Ajusta los filtros o realiza una nueva apuesta para verla aquí.
      </p>
    </div>
  );
}
