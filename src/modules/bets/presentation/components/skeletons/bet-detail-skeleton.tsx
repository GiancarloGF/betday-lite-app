import { Skeleton } from '@/shared/components/ui/skeleton';

/**
 * Loading state for the bet detail section.
 */
export function BetDetailSkeleton() {
  return (
    <section className="space-y-6">
      <div className="rounded-[1.9rem] bg-[linear-gradient(135deg,color-mix(in_oklch,var(--brand)_96%,white),color-mix(in_oklch,var(--brand)_82%,black))] px-6 py-7 text-white shadow-[0_26px_50px_-28px_color-mix(in_oklch,var(--brand)_42%,black)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-24 bg-white/20" />
            <Skeleton className="h-9 w-80 bg-white/20" />
            <Skeleton className="h-4 w-40 bg-white/20" />
          </div>

          <Skeleton className="h-6 w-24 rounded-full bg-white/20" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-card rounded-[1.5rem] border border-white/70 p-5 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.24)]"
          >
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-8 w-24" />
          </div>
        ))}
      </div>
    </section>
  );
}
