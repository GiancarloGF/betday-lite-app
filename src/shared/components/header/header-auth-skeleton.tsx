import { Skeleton } from '@/shared/components/ui/skeleton';

/**
 * Loading state for the header auth and wallet section.
 */
export function HeaderAuthSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
      <Skeleton className="h-10 w-24 rounded-full" />
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
  );
}
