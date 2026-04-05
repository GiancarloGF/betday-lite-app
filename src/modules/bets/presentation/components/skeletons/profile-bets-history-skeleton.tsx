import { Skeleton } from '@/shared/components/ui/skeleton';

/**
 * Loading state for the profile bets history section.
 */
export function ProfileBetsHistorySkeleton() {
  return (
    <section className="space-y-6">
      <div className="bg-card rounded-[1.6rem] border border-white/70 p-4 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-11 w-24 rounded-xl" />
            ))}
          </div>

          <Skeleton className="h-10 w-full lg:max-w-sm" />
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-card rounded-[1.7rem] border border-white/70 p-5 shadow-[0_24px_45px_-32px_rgba(15,23,42,0.28)]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-7 w-72" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="bg-muted/55 rounded-[1.1rem] p-3"
                    >
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="mt-2 h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 lg:items-end">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
