import { Skeleton } from '@/shared/components/ui/skeleton';

/**
 * Loading state for the bet detail section.
 */
export function BetDetailSkeleton() {
  return (
    <section className="space-y-6">
      <div className="border-border/70 overflow-hidden rounded-[2rem] border bg-slate-100/90 px-6 py-7 shadow-[0_26px_50px_-28px_rgba(15,23,42,0.14)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-6 w-24 rounded-full bg-white/80" />
            <Skeleton className="h-3 w-28 bg-white/80" />
            <Skeleton className="h-10 w-96 bg-white/80" />
          </div>

          <div className="grid gap-3">
            <Skeleton className="h-22 w-full rounded-[1.35rem] bg-white/80 sm:w-44" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-5 w-34" />
        <div className="border-border bg-card rounded-[1.7rem] border border-white/70 p-5 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)]">
          <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr]">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3 text-center">
                <Skeleton className="mx-auto h-18 w-18 rounded-[1.35rem]" />
                <Skeleton className="mx-auto h-6 w-32" />
                <Skeleton className="mx-auto h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-5 w-38" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(220px,0.6fr)]">
          <div className="border-border bg-card rounded-[1.7rem] border border-white/70 p-5 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-52" />
              </div>
              <Skeleton className="h-24 w-full rounded-[1.3rem] lg:w-44" />
            </div>
          </div>

          <div className="border-border bg-card rounded-[1.7rem] border border-white/70 p-5 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)]">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-4 h-10 w-32" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="border-border bg-card rounded-[1.4rem] border border-white/70 px-4 py-4 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.24)]"
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-3 h-4 w-40" />
            </div>
          ))}
        </div>
      </div>

      <div className="border-border bg-card grid gap-6 rounded-[1.7rem] border border-white/70 px-5 py-5 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)] sm:grid-cols-2 sm:px-6">
        <div>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-4 h-10 w-32" />
        </div>
        <div className="sm:text-right">
          <Skeleton className="ml-auto h-3 w-24" />
          <Skeleton className="mt-4 ml-auto h-12 w-40" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-card rounded-[1.4rem] border border-white/70 px-4 py-4 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.24)]"
          >
            <Skeleton className="h-3 w-18" />
            <Skeleton className="mt-3 h-5 w-24" />
          </div>
        ))}
      </div>
    </section>
  );
}
