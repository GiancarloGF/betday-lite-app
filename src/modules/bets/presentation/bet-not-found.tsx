import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';

/**
 * Renders a fallback when a bet is not found.
 */
export function BetNotFound() {
  return (
    <div className="border-border bg-card flex flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center">
      <p className="text-foreground text-lg font-semibold">
        Apuesta no encontrada
      </p>
      <p className="text-muted-foreground mt-2 text-sm">
        La apuesta que buscas no existe o no está disponible.
      </p>

      <Button asChild className="mt-6">
        <Link href="/profile">Volver al perfil</Link>
      </Button>
    </div>
  );
}
