import { Card } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

/**
 * Loading state for the home pending bets sidebar.
 */
export function PendingBetsPanelSkeleton() {
  return (
    <Card className="space-y-5 rounded-[1.7rem] p-5">
      <div className="space-y-2">
        <Skeleton className="h-4 w-36" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-surface relative overflow-hidden rounded-[1.35rem]"
          >
            <div className="bg-brand absolute inset-y-0 left-0 w-1.5 rounded-r-full opacity-20" />

            <div className="bg-card ml-3 space-y-4 rounded-[1.2rem] border border-white/70 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-20" />
                </div>

                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              <div className="bg-muted/50 grid grid-cols-3 gap-3 rounded-[1rem] p-3">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-4 w-6" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Skeleton className="h-10 w-full rounded-xl" />
    </Card>
  );
}
