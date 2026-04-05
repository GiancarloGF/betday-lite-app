'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/shared/lib/utils';

/**
 * Minimal client-only navigation for active link styling.
 */
export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-6 md:flex">
      <Link
        href="/"
        data-active={pathname === '/'}
        className={cn(
          'motion-nav-link text-sm font-semibold',
          pathname === '/' ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        Apuestas del dia
      </Link>
      <Link
        href="/profile"
        data-active={pathname === '/profile'}
        className={cn(
          'motion-nav-link text-sm font-semibold',
          pathname === '/profile' ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        Mis apuestas
      </Link>
    </nav>
  );
}
