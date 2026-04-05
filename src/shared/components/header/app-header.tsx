import Link from 'next/link';
import { Suspense } from 'react';

import { HeaderAuthContent } from '@/shared/components/header/header-auth-content';
import { HeaderAuthSkeleton } from '@/shared/components/header/header-auth-skeleton';
import { HeaderNav } from '@/shared/components/header/header-nav';

/**
 * Server-first application header shell.
 */
export function AppHeader() {
  return (
    <header className="border-border/80 bg-surface/95 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-345 flex-wrap items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="flex flex-wrap items-center gap-6">
          <Link
            href="/"
            className="text-brand text-[1.7rem] leading-none font-black"
          >
            BetDayLite
          </Link>

          <HeaderNav />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <Suspense fallback={<HeaderAuthSkeleton />}>
            <HeaderAuthContent />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
