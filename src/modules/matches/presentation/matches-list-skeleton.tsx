import { Skeleton } from '@/shared/components/ui/skeleton';

/**
 * Renders placeholder cards while the matches list is loading.
 */
export function MatchesListSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <article
          key={index}
          className="border-border bg-card rounded-2xl border p-5 shadow-sm"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>

            <Skeleton className="h-8 w-16 rounded-xl" />
          </div>

          <div className="mb-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-12" />
              </div>

              <Skeleton className="h-4 w-6" />

              <div className="space-y-2 text-right">
                <Skeleton className="ml-auto h-4 w-32" />
                <Skeleton className="ml-auto h-3 w-12" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, oddIndex) => (
              <div
                key={oddIndex}
                className="border-border bg-surface rounded-xl border px-3 py-3"
              >
                <Skeleton className="h-3 w-4" />
                <Skeleton className="mt-2 h-6 w-12" />
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
